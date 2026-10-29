import snapshot from './countries-snapshot.json'

export interface RestCountry {
  name: { common: string; official: string }
  cca2: string
  cca3: string
  ccn3: string
  capital?: readonly string[]
  population: number
  area: number
  currencies?: Record<string, { name: string; symbol: string }>
  languages?: Record<string, string>
  flags: { svg: string; png: string; alt?: string }
  region: string
  subregion?: string
  timezones: readonly string[]
}

export function getAllCountries(): RestCountry[] {
  return snapshot as unknown as RestCountry[]
}
