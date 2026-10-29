import type { Instrument, Quote, Point, TimeRange } from '@/types'

export interface MarketDataProvider {
  getInstruments(): Instrument[]
  getHistory(id: string, range: TimeRange): Point[]
  subscribe(ids: string[], onTick: (quote: Quote) => void): () => void
}
