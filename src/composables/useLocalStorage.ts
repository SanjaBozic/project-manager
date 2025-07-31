// composables/useLocalStorage.ts
import { useStorage } from '@vueuse/core';

export function useLocalStorage<T>(key: string, initialValue: T) {
  return useStorage<T>(key, initialValue);
}
