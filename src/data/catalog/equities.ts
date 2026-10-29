import type { Instrument } from '@/types'

export const equities: Instrument[] = [
  { id: 'AAPL', symbol: 'AAPL', name: 'Apple', group: 'equities', currency: 'USD', decimals: 2, basePrice: 185, annualVol: 0.28, drift: 0.15, correlationGroup: '__mag7__', correlationBeta: 0.75 },
  { id: 'MSFT', symbol: 'MSFT', name: 'Microsoft', group: 'equities', currency: 'USD', decimals: 2, basePrice: 380, annualVol: 0.26, drift: 0.18, correlationGroup: '__mag7__', correlationBeta: 0.78 },
  { id: 'GOOGL', symbol: 'GOOGL', name: 'Alphabet', group: 'equities', currency: 'USD', decimals: 2, basePrice: 140, annualVol: 0.30, drift: 0.14, correlationGroup: '__mag7__', correlationBeta: 0.72 },
  { id: 'AMZN', symbol: 'AMZN', name: 'Amazon', group: 'equities', currency: 'USD', decimals: 2, basePrice: 175, annualVol: 0.32, drift: 0.16, correlationGroup: '__mag7__', correlationBeta: 0.70 },
  { id: 'META', symbol: 'META', name: 'Meta', group: 'equities', currency: 'USD', decimals: 2, basePrice: 490, annualVol: 0.38, drift: 0.25, correlationGroup: '__mag7__', correlationBeta: 0.68 },
  { id: 'NVDA', symbol: 'NVDA', name: 'NVIDIA', group: 'equities', currency: 'USD', decimals: 2, basePrice: 850, annualVol: 0.55, drift: 0.45, correlationGroup: '__mag7__', correlationBeta: 0.65 },
  { id: 'TSLA', symbol: 'TSLA', name: 'Tesla', group: 'equities', currency: 'USD', decimals: 2, basePrice: 250, annualVol: 0.60, drift: 0.10, correlationGroup: '__mag7__', correlationBeta: 0.55 },
]
