import type { Instrument, Quote, Point, TimeRange } from '@/types'
import type { MarketDataProvider } from './types'
import { ALL_INSTRUMENTS, INSTRUMENT_MAP } from '@/data/catalog'
import { generateHistory, quoteFromHistory } from '@/data/engine/generators'
import { getTickEngine } from '@/data/engine/tickEngine'

const historyCache = new Map<string, Map<TimeRange, Point[]>>()

function getCachedHistory(id: string, range: TimeRange): Point[] {
  if (!historyCache.has(id)) historyCache.set(id, new Map())
  const rangeCache = historyCache.get(id)!
  if (!rangeCache.has(range)) {
    const inst = INSTRUMENT_MAP.get(id)
    if (!inst) return []
    rangeCache.set(range, generateHistory(inst, range))
  }
  return rangeCache.get(range)!
}

class MockProvider implements MarketDataProvider {
  private engine = getTickEngine()
  private initialized = false

  private ensureInit(): void {
    if (this.initialized) return
    this.initialized = true
    for (const inst of ALL_INSTRUMENTS) {
      const history = getCachedHistory(inst.id, '1D')
      this.engine.register(inst, history)
    }
  }

  getInstruments(): Instrument[] {
    return ALL_INSTRUMENTS
  }

  getHistory(id: string, range: TimeRange): Point[] {
    return getCachedHistory(id, range)
  }

  subscribe(ids: string[], onTick: (quote: Quote) => void): () => void {
    this.ensureInit()
    return this.engine.subscribe(ids, onTick)
  }

  getInitialQuotes(ids: string[]): Map<string, Quote> {
    const quotes = new Map<string, Quote>()
    for (const id of ids) {
      const history = getCachedHistory(id, '1D')
      if (history.length > 0) quotes.set(id, quoteFromHistory(id, history))
    }
    return quotes
  }
}

/** Swap to a real provider by changing this one line */
export const provider: MarketDataProvider = new MockProvider()

export const mockProvider = provider as MockProvider
