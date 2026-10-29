export interface RestCountry {
  name: { common: string; official: string }
  cca2: string
  cca3: string
  ccn3: string
  capital?: string[]
  population: number
  area: number
  currencies?: Record<string, { name: string; symbol: string }>
  languages?: Record<string, string>
  flags: { svg: string; png: string; alt?: string }
  region: string
  subregion?: string
  timezones: string[]
}

const CACHE_KEY = 'restcountries_v1'
const TTL_MS = 7 * 24 * 60 * 60 * 1000
const FIELDS = 'name,cca2,cca3,ccn3,capital,population,area,currencies,languages,flags,region,subregion,timezones'

export async function fetchAllCountries(): Promise<RestCountry[]> {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (raw) {
      const { data, ts } = JSON.parse(raw)
      if (Date.now() - ts < TTL_MS) return data
    }
  } catch {
    // storage unavailable or corrupt — proceed to fetch
  }

  const res = await fetch(`https://restcountries.com/v3.1/all?fields=${FIELDS}`)
  if (!res.ok) throw new Error(`REST Countries: ${res.status}`)
  const data: RestCountry[] = await res.json()

  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }))
  } catch {
    // storage full — ignore
  }

  return data
}
