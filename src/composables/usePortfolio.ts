import { computed } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import type { Point, TimeRange } from '@/types'
import { useMarketStore } from '@/stores/market'
import { equities } from '@/data/catalog/equities'
import { mulberry32, hashString, stdNormal } from '@/data/engine/prng'

/** Simulated portfolio weights — sum = 1 */
const WEIGHTS: Record<string, number> = {
  AAPL: 0.28, MSFT: 0.24, NVDA: 0.18, GOOGL: 0.10,
  AMZN: 0.10, META: 0.07, TSLA: 0.03,
}

const BASE_VALUE = 3_840_000_000

const STEP_MS: Record<TimeRange, number> = {
  '1D': 5 * 60_000,
  '5D': 30 * 60_000,
  '1M': 4 * 3_600_000,
  '3M': 86_400_000,
  '1Y': 86_400_000,
}

const DT_YEARS: Record<TimeRange, number> = {
  '1D': 5 / (365 * 24 * 60),
  '5D': 30 / (365 * 24 * 60),
  '1M': 4 / (365 * 24),
  '3M': 1 / 365,
  '1Y': 1 / 365,
}

function buildBenchmark(range: TimeRange, len: number, t0: number): Point[] {
  const dt = DT_YEARS[range]
  const step = STEP_MS[range]
  const rand = mulberry32(hashString('benchmark_sp500_' + range))
  const drift = 0.10
  const vol = 0.13
  let p = 100
  return Array.from({ length: len }, (_, i) => {
    if (i > 0) p *= Math.exp((drift - 0.5 * vol * vol) * dt + vol * Math.sqrt(dt) * stdNormal(rand))
    return { t: t0 + i * step, v: p }
  })
}

export const DONUT_COLORS = [
  '#60A5FA', '#F5B800', '#A78BFA', '#34D399',
  '#FB923C', '#F472B6', '#38BDF8',
]

export interface DonutSlice {
  id: string; name: string; symbol: string; weight: number; color: string
}

export interface PortfolioKpi {
  portfolioValue: number
  portfolioValueChange: number
  ytdReturn: number
  ytdReturnVsBenchmark: number
  bestPerformerId: string
  bestPerformerReturn: number
  weightedVol: number
}

export function usePortfolio(range: Ref<TimeRange>): {
  portfolioSeries: ComputedRef<Point[]>
  benchmarkSeries: ComputedRef<Point[]>
  kpis: ComputedRef<PortfolioKpi>
  donutSlices: DonutSlice[]
} {
  const store = useMarketStore()
  const ids = equities.map((e) => e.id)
  store.initQuotes(ids)

  const portfolioSeries = computed((): Point[] => {
    const histories = ids.map((id) => store.getHistory(id, range.value))
    const minLen = Math.min(...histories.map((h) => h.length))
    if (minLen === 0) return []
    return Array.from({ length: minLen }, (_, i) => {
      const weighted = ids.reduce((sum, id, j) => {
        const base = histories[j][0].v
        return sum + (WEIGHTS[id] ?? 0) * (histories[j][i].v / base)
      }, 0)
      return { t: histories[0][i].t, v: weighted * 100 }
    })
  })

  const benchmarkSeries = computed((): Point[] => {
    const h = store.getHistory(ids[0], range.value)
    if (h.length === 0) return []
    return buildBenchmark(range.value, h.length, h[0].t)
  })

  const kpis = computed((): PortfolioKpi => {
    const port = portfolioSeries.value
    const bench = benchmarkSeries.value
    const ytdReturn = port.length > 1 ? (port[port.length - 1].v - 100) / 100 : 0
    const benchReturn = bench.length > 1 ? (bench[bench.length - 1].v - 100) / 100 : 0

    let bestId = ids[0]
    let bestReturn = -Infinity
    for (const id of ids) {
      const h = store.getHistory(id, range.value)
      if (h.length < 2) continue
      const r = (h[h.length - 1].v - h[0].v) / h[0].v
      if (r > bestReturn) { bestReturn = r; bestId = id }
    }

    const weightedVol = ids.reduce((acc, id) => {
      const instr = equities.find((e) => e.id === id)!
      return acc + (WEIGHTS[id] ?? 0) * instr.annualVol
    }, 0)

    const portRatio = port.length > 0 ? port[port.length - 1].v / 100 : 1
    const portfolioValue = BASE_VALUE * portRatio

    return {
      portfolioValue,
      portfolioValueChange: portfolioValue - BASE_VALUE,
      ytdReturn,
      ytdReturnVsBenchmark: ytdReturn - benchReturn,
      bestPerformerId: bestId,
      bestPerformerReturn: bestReturn,
      weightedVol,
    }
  })

  const donutSlices: DonutSlice[] = equities.map((e, i) => ({
    id: e.id,
    name: e.name,
    symbol: e.symbol,
    weight: WEIGHTS[e.id] ?? 0,
    color: DONUT_COLORS[i],
  }))

  return { portfolioSeries, benchmarkSeries, kpis, donutSlices }
}
