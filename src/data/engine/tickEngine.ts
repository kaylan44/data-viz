import type { Instrument, Quote, Point } from '@/types'
import { stdNormal } from './prng'

type TickCallback = (quote: Quote) => void

interface InstrumentState {
  instrument: Instrument
  history: Point[]
  last: number
  prevClose: number
  dayOpen: number
  dayLow: number
  dayHigh: number
  timer: ReturnType<typeof setTimeout> | null
}

function randInterval(): number {
  return 800 + Math.random() * 1700
}

function nextTick(state: InstrumentState): Quote {
  // GBM micro-step (1-second equivalent dt)
  const dtYears = 1 / (365 * 24 * 3600)
  const { annualVol, drift } = state.instrument
  const z = stdNormal(Math.random)
  const logRet = (drift - 0.5 * annualVol * annualVol) * dtYears + annualVol * Math.sqrt(dtYears) * z
  const newPrice = state.last * Math.exp(logRet)
  state.last = newPrice
  state.dayLow = Math.min(state.dayLow, newPrice)
  state.dayHigh = Math.max(state.dayHigh, newPrice)

  // Append/update last point in history
  const now = Date.now()
  const lastPt = state.history[state.history.length - 1]
  if (lastPt && now - lastPt.t < 60_000) {
    lastPt.v = newPrice
    lastPt.t = now
  } else {
    state.history.push({ t: now, v: newPrice })
    if (state.history.length > 500) state.history.shift()
  }

  const change = newPrice - state.prevClose
  const changePct = change / state.prevClose
  return {
    id: state.instrument.id,
    last: newPrice,
    prevClose: state.prevClose,
    change,
    changePct,
    dayLow: state.dayLow,
    dayHigh: state.dayHigh,
    ts: now,
  }
}

export class TickEngine {
  private states = new Map<string, InstrumentState>()
  private callbacks = new Set<TickCallback>()
  private paused = false
  private handleVisibility: () => void

  constructor() {
    this.handleVisibility = () => {
      if (document.hidden) {
        this.pause()
      } else {
        this.resume()
      }
    }
    document.addEventListener('visibilitychange', this.handleVisibility)
  }

  register(instrument: Instrument, history: Point[]): void {
    const last = history.length > 0 ? history[history.length - 1].v : instrument.basePrice
    const prevClose = history.length > 0 ? history[0].v : instrument.basePrice
    const dayBars = history.slice(-288)
    this.states.set(instrument.id, {
      instrument,
      history,
      last,
      prevClose,
      dayOpen: prevClose,
      dayLow: dayBars.length > 0 ? Math.min(...dayBars.map((p) => p.v)) : last * 0.99,
      dayHigh: dayBars.length > 0 ? Math.max(...dayBars.map((p) => p.v)) : last * 1.01,
      timer: null,
    })
  }

  subscribe(ids: string[], cb: TickCallback): () => void {
    this.callbacks.add(cb)
    for (const id of ids) this.scheduleTick(id)
    return () => {
      this.callbacks.delete(cb)
    }
  }

  private scheduleTick(id: string): void {
    const state = this.states.get(id)
    if (!state || this.paused) return
    state.timer = setTimeout(() => {
      if (this.paused) return
      const quote = nextTick(state)
      for (const cb of this.callbacks) cb(quote)
      this.scheduleTick(id)
    }, randInterval())
  }

  private clearTimer(state: InstrumentState): void {
    if (state.timer !== null) {
      clearTimeout(state.timer)
      state.timer = null
    }
  }

  pause(): void {
    this.paused = true
    for (const state of this.states.values()) this.clearTimer(state)
  }

  resume(): void {
    if (!this.paused) return
    this.paused = false
    for (const id of this.states.keys()) this.scheduleTick(id)
  }

  getHistory(id: string): Point[] {
    return this.states.get(id)?.history ?? []
  }

  destroy(): void {
    this.pause()
    document.removeEventListener('visibilitychange', this.handleVisibility)
    this.callbacks.clear()
    this.states.clear()
  }
}

let _engine: TickEngine | null = null

/** Singleton engine — created once, reused across the app */
export function getTickEngine(): TickEngine {
  if (!_engine) _engine = new TickEngine()
  return _engine
}
