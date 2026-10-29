import type { Instrument } from '@/types'

export const indices: Instrument[] = [
  { id: 'SPX', symbol: 'SPX', name: 'S&P 500', group: 'indices', currency: 'USD', decimals: 0, basePrice: 5000, annualVol: 0.18, drift: 0.10 },
  { id: 'NDX', symbol: 'NDX', name: 'Nasdaq-100', group: 'indices', currency: 'USD', decimals: 0, basePrice: 17500, annualVol: 0.22, drift: 0.14 },
  { id: 'DJIA', symbol: 'DJIA', name: 'Dow Jones', group: 'indices', currency: 'USD', decimals: 0, basePrice: 39000, annualVol: 0.16, drift: 0.09 },
  { id: 'SX5E', symbol: 'SX5E', name: 'Euro Stoxx 50', group: 'indices', currency: 'EUR', decimals: 0, basePrice: 4800, annualVol: 0.20, drift: 0.08 },
  { id: 'CAC', symbol: 'CAC', name: 'CAC 40', group: 'indices', currency: 'EUR', decimals: 0, basePrice: 7800, annualVol: 0.20, drift: 0.08 },
  { id: 'DAX', symbol: 'DAX', name: 'DAX', group: 'indices', currency: 'EUR', decimals: 0, basePrice: 18000, annualVol: 0.20, drift: 0.09 },
  { id: 'FTSE', symbol: 'FTSE', name: 'FTSE 100', group: 'indices', currency: 'GBP', decimals: 0, basePrice: 8000, annualVol: 0.17, drift: 0.07 },
  { id: 'NKY', symbol: 'NKY', name: 'Nikkei 225', group: 'indices', currency: 'JPY', decimals: 0, basePrice: 38000, annualVol: 0.22, drift: 0.10 },
  { id: 'HSI', symbol: 'HSI', name: 'Hang Seng', group: 'indices', currency: 'HKD', decimals: 0, basePrice: 17000, annualVol: 0.25, drift: 0.02 },
  { id: 'IDX', symbol: 'IDX', name: 'IDX Composite', group: 'indices', currency: 'IDR', decimals: 0, basePrice: 7300, annualVol: 0.18, drift: 0.06 },
  { id: 'STI', symbol: 'STI', name: 'Straits Times', group: 'indices', currency: 'SGD', decimals: 0, basePrice: 3200, annualVol: 0.15, drift: 0.05 },
]

export const rates: Instrument[] = [
  { id: 'VIX', symbol: 'VIX', name: 'VIX', group: 'rates', currency: 'USD', decimals: 2, basePrice: 18, annualVol: 0.80, drift: 0.0, meanReverts: true, meanReversionSpeed: 5 },
  { id: 'US10Y', symbol: 'US10Y', name: 'US 10Y Yield', group: 'rates', currency: 'USD', unit: '%', decimals: 3, basePrice: 4.3, annualVol: 0.25, drift: 0.0, meanReverts: true, meanReversionSpeed: 0.5 },
  { id: 'DXY', symbol: 'DXY', name: 'DXY Index', group: 'rates', currency: 'USD', decimals: 2, basePrice: 104, annualVol: 0.08, drift: 0.0, meanReverts: true, meanReversionSpeed: 0.3 },
]

export const fx: Instrument[] = [
  { id: 'EURUSD', symbol: 'EUR/USD', name: 'Euro / US Dollar', group: 'fx', currency: 'USD', decimals: 4, basePrice: 1.085, annualVol: 0.07, drift: 0.0, meanReverts: true, meanReversionSpeed: 0.3 },
  { id: 'USDJPY', symbol: 'USD/JPY', name: 'US Dollar / Yen', group: 'fx', currency: 'JPY', decimals: 2, basePrice: 149.5, annualVol: 0.09, drift: 0.0, meanReverts: true, meanReversionSpeed: 0.3 },
  { id: 'USDIDR', symbol: 'USD/IDR', name: 'US Dollar / Rupiah', group: 'fx', currency: 'IDR', decimals: 0, basePrice: 15600, annualVol: 0.06, drift: 0.0, meanReverts: true, meanReversionSpeed: 0.2 },
]

export const commoditiesCrypto: Instrument[] = [
  { id: 'GOLD', symbol: 'XAU', name: 'Gold', group: 'commodities', currency: 'USD', unit: '$/oz', decimals: 0, basePrice: 2050, annualVol: 0.14, drift: 0.05 },
  { id: 'COPPER', symbol: 'HG', name: 'Copper', group: 'commodities', currency: 'USD', unit: '$/lb', decimals: 3, basePrice: 4.1, annualVol: 0.25, drift: 0.03 },
  { id: 'NATGAS', symbol: 'NG', name: 'Natural Gas', group: 'commodities', currency: 'USD', unit: '$/MMBtu', decimals: 3, basePrice: 2.8, annualVol: 0.50, drift: 0.0 },
  { id: 'BTC', symbol: 'BTC', name: 'Bitcoin', group: 'crypto', currency: 'USD', decimals: 0, basePrice: 62000, annualVol: 0.80, drift: 0.30 },
]
