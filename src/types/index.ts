export type InstrumentGroup = 'equities' | 'oil' | 'indices' | 'rates' | 'fx' | 'commodities' | 'crypto'

export type MeanReverts = boolean

export interface Instrument {
  id: string
  symbol: string
  name: string
  group: InstrumentGroup
  currency: string
  unit?: string
  decimals: number
  basePrice: number
  annualVol: number
  drift: number
  meanReverts?: boolean
  meanReversionSpeed?: number
  correlationGroup?: string
  correlationBeta?: number
}

export interface Quote {
  id: string
  last: number
  prevClose: number
  change: number
  changePct: number
  dayLow: number
  dayHigh: number
  ts: number
}

export interface Point {
  t: number
  v: number
}

export type TimeRange = '1D' | '5D' | '1M' | '3M' | '1Y'

export type ChartMode = 'absolute' | 'normalized100'
