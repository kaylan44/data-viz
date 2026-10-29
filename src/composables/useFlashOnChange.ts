import { ref, watch, onUnmounted } from 'vue'
import type { Ref } from 'vue'

export type FlashDirection = 'up' | 'down' | ''

const reducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function useFlashOnChange(value: Ref<number>, duration = 600) {
  const direction = ref<FlashDirection>('')
  let timer: ReturnType<typeof setTimeout> | null = null

  watch(value, (next, prev) => {
    if (reducedMotion || next === prev) return
    if (timer) clearTimeout(timer)
    direction.value = next >= prev ? 'up' : 'down'
    timer = setTimeout(() => {
      direction.value = ''
    }, duration)
  })

  onUnmounted(() => {
    if (timer) clearTimeout(timer)
  })

  return { direction }
}
