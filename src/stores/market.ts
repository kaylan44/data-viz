import { defineStore } from 'pinia'
import { shallowReactive } from 'vue'
import type { Quote, Point, TimeRange } from '@/types'
import { provider } from '@/data/providers/mockProvider'
import { quoteFromHistory } from '@/data/engine/generators'

export const useMarketStore = defineStore('market', () => {
  const quotes = shallowReactive(new Map<string, Quote>())
  const historyCache = shallowReactive(new Map<string, Map<TimeRange, Point[]>>())

  function initQuotes(ids: string[]): void {
    for (const id of ids) {
      if (!quotes.has(id)) {
        const history = provider.getHistory(id, '1D')
        if (history.length > 0) quotes.set(id, quoteFromHistory(id, history))
      }
    }
  }

  function updateQuote(quote: Quote): void {
    quotes.set(quote.id, quote)
  }

  function subscribe(ids: string[]): () => void {
    initQuotes(ids)
    return provider.subscribe(ids, (q) => updateQuote(q))
  }

  function getHistory(id: string, range: TimeRange): Point[] {
    if (!historyCache.has(id)) historyCache.set(id, new Map())
    const rc = historyCache.get(id)!
    if (!rc.has(range)) rc.set(range, provider.getHistory(id, range))
    return rc.get(range)!
  }

  return { quotes, subscribe, getHistory, initQuotes }
})
