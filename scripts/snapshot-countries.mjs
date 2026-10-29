/**
 * Fetches REST Countries data and writes src/data/countries/countries-snapshot.json.
 * Run once: node scripts/snapshot-countries.mjs
 */
import { writeFileSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'

const OUT_PATH = join(dirname(fileURLToPath(import.meta.url)), '../src/data/countries/countries-snapshot.json')
const FIELDS = 'name,cca2,cca3,ccn3,capital,population,area,currencies,languages,flags,region,subregion,timezones'
const URL = `https://restcountries.com/v3.1/all?fields=${FIELDS}`

async function main() {
  console.log('Fetching from REST Countries API…')
  const res = await fetch(URL)
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
  const data = await res.json()
  mkdirSync(dirname(OUT_PATH), { recursive: true })
  writeFileSync(OUT_PATH, JSON.stringify(data, null, 2))
  console.log(`Written ${data.length} countries → ${OUT_PATH}`)
}

main().catch((e) => { console.error(e); process.exit(1) })
