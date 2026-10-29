import { onMounted, onUnmounted, computed } from 'vue'
import type { ComputedRef } from 'vue'
import type { Quote } from '@/types'
import { useMarketStore } from '@/stores/market'

export function useLiveQuotes(ids: string[]): { quotes: ComputedRef<Map<string, Quote>> } {
  const store = useMarketStore()
  let unsubscribe: (() => void) | null = null

  onMounted(() => {
    unsubscribe = store.subscribe(ids)
  })

  onUnmounted(() => {
    unsubscribe?.()
  })

  const quotes = computed(() => {
    const map = new Map<string, Quote>()
    for (const id of ids) {
      const q = store.quotes.get(id)
      if (q) map.set(id, q)
    }
    return map
  })

  return { quotes }
}
