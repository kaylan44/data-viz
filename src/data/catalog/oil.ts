import type { Instrument } from '@/types'

export const oil: Instrument[] = [
  { id: 'BRENT', symbol: 'BRT', name: 'Brent Crude', group: 'oil', currency: 'USD', unit: '$/bbl', decimals: 2, basePrice: 83, annualVol: 0.25, drift: 0.0, correlationGroup: '__oil__', correlationBeta: 0.92 },
  { id: 'WTI', symbol: 'WTI', name: 'WTI Crude', group: 'oil', currency: 'USD', unit: '$/bbl', decimals: 2, basePrice: 78, annualVol: 0.26, drift: 0.0, correlationGroup: '__oil__', correlationBeta: 0.90 },
  { id: 'DUBAI', symbol: 'DXB', name: 'Dubai Crude', group: 'oil', currency: 'USD', unit: '$/bbl', decimals: 2, basePrice: 80, annualVol: 0.24, drift: 0.0, correlationGroup: '__oil__', correlationBeta: 0.88 },
]
