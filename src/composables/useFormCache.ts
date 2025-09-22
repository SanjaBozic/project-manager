import { ref, reactive, toRaw, watch } from 'vue'
import { useLocalStorage } from './useLocalStorage' // your thin wrapper over useStorage

function generateId(): string {
  return crypto?.randomUUID?.() || Math.random().toString(36).substring(2, 10)
}

export function useFormCache<T extends Record<string, any>>(formKey: string) {
  // persisted plain JSON array via @vueuse useStorage
  const rawStorage = useLocalStorage<(T & { id: string })[]>(formKey, [])

  // reactive in-memory proxies for app consumption
  const cache = ref<Array<T & { id: string }>>([])

  // helper to create a reactive proxy from a plain object
  const makeProxy = (item: any) => reactive({ ...item }) as T & { id: string }

  // initialize cache from raw storage (synchronous)
  const rebuildCacheFromStorage = () => {
    try {
      const plain = rawStorage.value ?? []
      cache.value = plain.map(item => makeProxy(item))
    } catch (e) {
      console.error('[useFormCache] rebuild failed', e)
      cache.value = []
    }
  }

  // run initial build
  rebuildCacheFromStorage()

  // keep cache in sync if rawStorage changes from elsewhere
  watch(
    () => rawStorage.value,
    () => {
      rebuildCacheFromStorage()
    },
    { deep: true }
  )

  // utility: ensure plain JSON (strip proxies and non-serializable internals)
  const toPlain = (v: any) => {
    try {
      return JSON.parse(JSON.stringify(toRaw(v)))
    } catch {
      // fallback: attempt stringify on v directly
      return JSON.parse(JSON.stringify(v))
    }
  }

  // guaranteed synchronous persistence helper
  const persistSync = (plainArray: Array<T & { id: string }>) => {
    try {
      // direct localStorage write is synchronous and immediate
      localStorage.setItem(formKey, JSON.stringify(plainArray))
      // also update the useStorage wrapper so reactive users of rawStorage get the new value
      rawStorage.value = plainArray
    } catch (e) {
      console.error('[useFormCache] persistSync failed', e)
      throw e
    }
  }

  // create and persist a new entry
  async function save(values: T) {
    const entry = { ...toPlain(values), id: generateId() }
    const existingPlain = (rawStorage.value ?? []).map(i => toPlain(i))
    const newPlain = [...existingPlain, entry]

    // synchronous persist
    persistSync(newPlain)

    // rebuild proxies in memory
    rebuildCacheFromStorage()

    // return saved entry for convenience
    return entry
  }

  // update an entry by id; returns updated entry or null
  async function update(id: string, patch: Partial<T>) {
    const existing = (rawStorage.value ?? []).map(i => toPlain(i))
    const idx = existing.findIndex(i => i.id === id)
    if (idx === -1) return null
    existing[idx] = { ...existing[idx], ...toPlain(patch) }
    persistSync(existing)
    rebuildCacheFromStorage()
    return existing[idx]
  }

  // remove an entry by id; returns removed id or null
  async function remove(id: string) {
    const existing = (rawStorage.value ?? []).map(i => toPlain(i))
    const idx = existing.findIndex(i => i.id === id)
    if (idx === -1) return null
    existing.splice(idx, 1)
    persistSync(existing)
    rebuildCacheFromStorage()
    return id
  }

  // clear all
  async function clear() {
    persistSync([])
    cache.value = []
  }

  // synchronous helper to get plain data (not reactive)
  function getPlainAll() {
    return (rawStorage.value ?? []).map(i => toPlain(i))
  }

  // expose a ready Promise in case consumer wants to await initialization (here it's immediate)
  const ready = Promise.resolve()

  return {
    // reactive proxies for components
    cache,
    // persisted plain data helpers
    rawStorage,
    getPlainAll,
    // operations (all return Promise so caller can await)
    save,
    update,
    remove,
    clear,
    // initialization marker
    ready
  }
}
