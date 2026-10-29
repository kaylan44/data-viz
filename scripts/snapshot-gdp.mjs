/**
 * Fetches World Bank GDP data and writes src/data/countries/gdp-snapshot.json.
 * Run once: node scripts/snapshot-gdp.mjs
 * No API key required. Uses the most recent non-null value (up to 5 years back).
 */
import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'

const OUT_PATH = join(dirname(fileURLToPath(import.meta.url)), '../src/data/countries/gdp-snapshot.json')
const WB_BASE = 'https://api.worldbank.org/v2/country/all/indicator'
async function fetchIndicator(indicator) {
  const rows = []
  let page = 1
  while (true) {
    const url = `${WB_BASE}/${indicator}?format=json&per_page=1000&mrv=5&page=${page}`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`World Bank ${indicator} p${page}: ${res.status}`)
    const [meta, data] = await res.json()
    if (data) rows.push(...data)
    if (!meta || rows.length >= meta.total) break
    page++
  }
  return rows
}

function mostRecent(rows) {
  const map = new Map()
  for (const row of rows) {
    const iso3 = row.countryiso3code
    if (!iso3 || row.value === null) continue
    if (!map.has(iso3) || row.date > map.get(iso3).date) {
      map.set(iso3, { value: row.value, date: row.date })
    }
  }
  return map
}

async function main() {
  console.log('Fetching GDP data from World Bank…')
  const [gdpRows, pcRows] = await Promise.all([
    fetchIndicator('NY.GDP.MKTP.CD'),
    fetchIndicator('NY.GDP.PCAP.CD'),
  ])

  const gdpMap = mostRecent(gdpRows)
  const pcMap  = mostRecent(pcRows)

  const allKeys = new Set([...gdpMap.keys(), ...pcMap.keys()])
  const snapshot = {}

  for (const iso3 of allKeys) {
    const gdp = gdpMap.get(iso3)
    const pc  = pcMap.get(iso3)
    snapshot[iso3] = {
      gdp:          gdp?.value ?? null,
      gdpPerCapita: pc?.value  ?? null,
      year:         gdp?.date  ?? pc?.date ?? null,
      source:       'World Bank',
    }
  }

  writeFileSync(OUT_PATH, JSON.stringify(snapshot, null, 2))
  console.log(`Written ${Object.keys(snapshot).length} entries → ${OUT_PATH}`)
}

main().catch((e) => { console.error(e); process.exit(1) })
