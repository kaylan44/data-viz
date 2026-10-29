import { equities } from './equities'
import { oil } from './oil'
import { indices, rates, fx, commoditiesCrypto } from './overview'
import type { Instrument } from '@/types'

export const ALL_INSTRUMENTS: Instrument[] = [
  ...equities,
  ...oil,
  ...indices,
  ...rates,
  ...fx,
  ...commoditiesCrypto,
]

export const INSTRUMENT_MAP: Map<string, Instrument> = new Map(
  ALL_INSTRUMENTS.map((i) => [i.id, i]),
)

export { equities, oil, indices, rates, fx, commoditiesCrypto }
