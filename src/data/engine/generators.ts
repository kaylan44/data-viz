import type { Instrument, Point, TimeRange } from '@/types'
import { mulberry32, hashString, stdNormal } from './prng'

interface RangeParams {
  bars: number
  dtYears: number
  stepMs: number
}

const RANGE_PARAMS: Record<TimeRange, RangeParams> = {
  '1D': { bars: 288, dtYears: 5 / (365 * 24 * 60), stepMs: 5 * 60 * 1000 },
  '5D': { bars: 240, dtYears: 30 / (365 * 24 * 60), stepMs: 30 * 60 * 1000 },
  '1M': { bars: 180, dtYears: 4 / (365 * 24), stepMs: 4 * 60 * 60 * 1000 },
  '3M': { bars: 90, dtYears: 1 / 365, stepMs: 24 * 60 * 60 * 1000 },
  '1Y': { bars: 365, dtYears: 1 / 365, stepMs: 24 * 60 * 60 * 1000 },
}

const RANGE_INDEX: Record<TimeRange, number> = { '1D': 0, '5D': 1, '1M': 2, '3M': 3, '1Y': 4 }

/** T0: today at midnight UTC — deterministic anchor, changes once per day */
function todayMidnightUtc(): number {
  const now = Date.now()
  return now - (now % 86_400_000)
}

/** Generate a log-return series for a correlation factor (shared across a group) */
function generateFactorReturns(groupKey: string, range: TimeRange): Float64Array {
  const { bars, dtYears } = RANGE_PARAMS[range]
  const rand = mulberry32(hashString(groupKey + range))
  const vol = 0.2 // generic factor vol
  const returns = new Float64Array(bars)
  for (let i = 0; i < bars; i++) {
    returns[i] = (vol * Math.sqrt(dtYears)) * stdNormal(rand)
  }
  return returns
}

/** Geometric Brownian Motion step array, returns prices starting from basePrice */
function gbmSeries(
  basePrice: number,
  drift: number,
  vol: number,
  bars: number,
  dtYears: number,
  rand: () => number,
  factorReturns?: Float64Array,
  beta = 0,
): number[] {
  const prices: number[] = [basePrice]
  let p = basePrice
  for (let i = 0; i < bars - 1; i++) {
    const z = stdNormal(rand)
    const idio = Math.sqrt(Math.max(0, 1 - beta * beta))
    const logReturn =
      (drift - 0.5 * vol * vol) * dtYears +
      vol * Math.sqrt(dtYears) * (factorReturns ? beta * factorReturns[i] / (0.2 * Math.sqrt(dtYears)) * vol * Math.sqrt(dtYears) + idio * z : z)
    p = p * Math.exp(logReturn)
    prices.push(p)
  }
  return prices
}

/** Ornstein-Uhlenbeck (mean-reverting) series */
function ouSeries(
  basePrice: number,
  speed: number,
  vol: number,
  bars: number,
  dtYears: number,
  rand: () => number,
): number[] {
  const prices: number[] = [basePrice]
  let p = basePrice
  for (let i = 0; i < bars - 1; i++) {
    const z = stdNormal(rand)
    p = p + speed * (basePrice - p) * dtYears + vol * basePrice * Math.sqrt(dtYears) * z
    p = Math.max(p, basePrice * 0.1)
    prices.push(p)
  }
  return prices
}

/** Correlated GBM using a pre-generated factor */
function correlatedGbmSeries(
  basePrice: number,
  drift: number,
  vol: number,
  bars: number,
  dtYears: number,
  rand: () => number,
  factorReturns: Float64Array,
  beta: number,
): number[] {
  const prices: number[] = [basePrice]
  let p = basePrice
  const idioWeight = Math.sqrt(Math.max(0, 1 - beta * beta))
  for (let i = 0; i < bars - 1; i++) {
    const zIdio = stdNormal(rand)
    // factor returns already are N(0, factorVol*sqrt(dt)); normalise to unit then rescale
    const factorUnit = factorReturns[i] / (0.2 * Math.sqrt(dtYears))
    const blendedZ = beta * factorUnit + idioWeight * zIdio
    const logReturn = (drift - 0.5 * vol * vol) * dtYears + vol * Math.sqrt(dtYears) * blendedZ
    p = p * Math.exp(logReturn)
    prices.push(p)
  }
  return prices
}

export function generateHistory(instrument: Instrument, range: TimeRange): Point[] {
  const { bars, dtYears, stepMs } = RANGE_PARAMS[range]
  const rangeIdx = RANGE_INDEX[range]
  const seed = hashString(instrument.id + String(rangeIdx))
  const rand = mulberry32(seed)
  const t0 = todayMidnightUtc() - bars * stepMs

  let prices: number[]

  if (instrument.meanReverts) {
    prices = ouSeries(
      instrument.basePrice,
      instrument.meanReversionSpeed ?? 2,
      instrument.annualVol,
      bars,
      dtYears,
      rand,
    )
  } else if (instrument.correlationGroup) {
    const factorReturns = generateFactorReturns(instrument.correlationGroup, range)
    prices = correlatedGbmSeries(
      instrument.basePrice,
      instrument.drift,
      instrument.annualVol,
      bars,
      dtYears,
      rand,
      factorReturns,
      instrument.correlationBeta ?? 0.7,
    )
  } else {
    prices = gbmSeries(
      instrument.basePrice,
      instrument.drift,
      instrument.annualVol,
      bars,
      dtYears,
      rand,
    )
  }

  return prices.map((v, i) => ({ t: t0 + i * stepMs, v }))
}

/** Derive a Quote snapshot from a history series */
export function quoteFromHistory(id: string, history: Point[]): import('@/types').Quote {
  if (history.length === 0) throw new Error(`Empty history for ${id}`)
  const last = history[history.length - 1].v
  const prevClose = history[0].v
  const change = last - prevClose
  const changePct = change / prevClose
  const dayBars = history.slice(-Math.min(288, history.length))
  const dayLow = Math.min(...dayBars.map((p) => p.v))
  const dayHigh = Math.max(...dayBars.map((p) => p.v))
  return { id, last, prevClose, change, changePct, dayLow, dayHigh, ts: history[history.length - 1].t }
}
