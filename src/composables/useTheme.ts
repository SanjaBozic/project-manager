import { ref, watch } from 'vue';
import { useLocalStorage } from '@/composables/useLocalStorage';

export function useTheme() {
  const isDark = useLocalStorage<boolean>('darkMode', false);
  const checked = ref<boolean>(isDark.value);

  const applyClass = (value: boolean) => {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.toggle('dark-mode', value);
  };

  // keep storage and DOM in sync when UI changes
  watch(checked, v => {
    isDark.value = v;
    applyClass(v);
  }, { immediate: true });

  // keep checked in sync if storage changed elsewhere
  watch(isDark, v => {
    if (checked.value !== v) checked.value = v;
  });

  return { checked, isDark } as const;
}
