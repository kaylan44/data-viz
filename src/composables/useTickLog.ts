import { ref, onMounted, onUnmounted } from 'vue'
import type { Quote } from '@/types'
import { provider } from '@/data/providers/mockProvider'
import { INSTRUMENT_MAP } from '@/data/catalog'

export interface TickEntry {
  quote: Quote
  symbol: string
  name: string
  ts: number
}

export function useTickLog(ids: string[], maxEntries = 20) {
  const ticks = ref<TickEntry[]>([])
  let unsubscribe: (() => void) | null = null

  onMounted(() => {
    unsubscribe = provider.subscribe(ids, (q) => {
      const inst = INSTRUMENT_MAP.get(q.id)
      if (!inst) return
      ticks.value.unshift({ quote: q, symbol: inst.symbol, name: inst.name, ts: q.ts })
      if (ticks.value.length > maxEntries) ticks.value.length = maxEntries
    })
  })

  onUnmounted(() => unsubscribe?.())

  return { ticks }
}
