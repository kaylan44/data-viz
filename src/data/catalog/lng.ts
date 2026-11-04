import type { Instrument } from '@/types'

export const lng: Instrument[] = [
  { id: 'JKM',  symbol: 'JKM',  name: 'JKM (Asia Spot)',    group: 'commodities', currency: 'USD', unit: '$/MMBtu', decimals: 3, basePrice: 12.5, annualVol: 0.55, drift: 0.0, meanReverts: true, meanReversionSpeed: 1.5 },
  { id: 'TTF',  symbol: 'TTF',  name: 'TTF (Europe Hub)',   group: 'commodities', currency: 'EUR', unit: '€/MWh',  decimals: 3, basePrice: 38.0, annualVol: 0.60, drift: 0.0, meanReverts: true, meanReversionSpeed: 1.2 },
  { id: 'NBP',  symbol: 'NBP',  name: 'NBP (UK Hub)',       group: 'commodities', currency: 'GBP', unit: 'p/therm', decimals: 2, basePrice: 95.0, annualVol: 0.55, drift: 0.0, meanReverts: true, meanReversionSpeed: 1.2 },
  { id: 'HH',   symbol: 'HH',   name: 'Henry Hub (US)',     group: 'commodities', currency: 'USD', unit: '$/MMBtu', decimals: 3, basePrice: 2.8,  annualVol: 0.50, drift: 0.0, meanReverts: true, meanReversionSpeed: 1.0 },
]
