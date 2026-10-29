import { computed, ref } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import type { Point, TimeRange } from '@/types'
import { useMarketStore } from '@/stores/market'

export function useHistory(
  id: string,
  range: Ref<TimeRange> | TimeRange,
): { history: ComputedRef<Point[]> } {
  const store = useMarketStore()
  const rangeRef = typeof range === 'string' ? ref(range) : range

  const history = computed(() => store.getHistory(id, rangeRef.value))

  return { history }
}
