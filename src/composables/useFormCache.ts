import { useLocalStorage } from './useLocalStorage'

function generateId(): string {
  return crypto.randomUUID?.() || Math.random().toString(36).substring(2, 10);
}

export function useFormCache<T extends Record<string, any>>(formKey: string) {
  const cache = useLocalStorage<(T & { id: string })[]>(formKey, [])

  function save(values: T) {
    const entry = { ...values, id: generateId() }
    cache.value.push(entry)
  }

  function clear() {
    cache.value = []
  }

  return {
    cache,
    save,
    clear
  }
}