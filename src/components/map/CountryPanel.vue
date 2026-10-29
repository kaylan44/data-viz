<script setup lang="ts">
import { computed } from 'vue'
import type { RestCountry } from '@/data/countries/restCountriesClient'
import type gdpRaw from '@/data/countries/gdp-snapshot.json'

type GdpSnapshot = typeof gdpRaw

const props = defineProps<{
  country: RestCountry | null
  gdp: GdpSnapshot
}>()

const emit = defineEmits<{ close: [] }>()

const gdpEntry = computed(() => {
  if (!props.country) return null
  return (props.gdp as Record<string, { gdp: number | null; gdpPerCapita: number | null; year: string | null }>)[props.country.cca3] ?? null
})

function fmtBig(n: number | null | undefined): string {
  if (n == null) return '—'
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`
  return `$${n.toFixed(0)}`
}

function fmtPop(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`
  return String(n)
}

function fmtArea(n: number): string {
  return n.toLocaleString('en-US') + ' km²'
}

const currencies = computed(() => {
  if (!props.country?.currencies) return []
  return Object.entries(props.country.currencies).map(([code, c]) => `${c.name} (${c.symbol || code})`)
})

const languages = computed(() => {
  if (!props.country?.languages) return []
  return Object.values(props.country.languages)
})
</script>

<template>
  <Transition name="panel-slide">
    <div v-if="country" class="country-panel" role="complementary" :aria-label="country.name.common">
      <!-- Header -->
      <div class="panel-header">
        <img
          v-if="country.flags?.svg"
          :src="country.flags.svg"
          :alt="country.flags.alt ?? country.name.common + ' flag'"
          class="flag"
        />
        <div class="title-block">
          <div class="country-name">{{ country.name.common }}</div>
          <div class="official-name">{{ country.name.official }}</div>
        </div>
        <button class="close-btn" aria-label="Close" @click="emit('close')">✕</button>
      </div>

      <!-- Stats grid -->
      <div class="stats-grid">
        <div class="stat">
          <span class="stat-label">Region</span>
          <span class="stat-value">{{ country.region }}{{ country.subregion ? ` · ${country.subregion}` : '' }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Capital</span>
          <span class="stat-value">{{ country.capital?.[0] ?? '—' }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Population</span>
          <span class="stat-value mono">{{ fmtPop(country.population) }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Area</span>
          <span class="stat-value mono">{{ fmtArea(country.area) }}</span>
        </div>
        <div v-if="gdpEntry" class="stat">
          <span class="stat-label">GDP{{ gdpEntry.year ? ` (${gdpEntry.year})` : '' }}</span>
          <span class="stat-value mono">{{ fmtBig(gdpEntry.gdp) }}</span>
        </div>
        <div v-if="gdpEntry?.gdpPerCapita" class="stat">
          <span class="stat-label">GDP per capita</span>
          <span class="stat-value mono">{{ fmtBig(gdpEntry.gdpPerCapita) }}</span>
        </div>
      </div>

      <div v-if="currencies.length" class="section">
        <div class="section-label">Currencies</div>
        <div class="tag-list">
          <span v-for="c in currencies" :key="c" class="tag">{{ c }}</span>
        </div>
      </div>

      <div v-if="languages.length" class="section">
        <div class="section-label">Languages</div>
        <div class="tag-list">
          <span v-for="l in languages" :key="l" class="tag">{{ l }}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-label">Timezones</div>
        <div class="tag-list">
          <span v-for="tz in country.timezones" :key="tz" class="tag mono">{{ tz }}</span>
        </div>
      </div>

      <div class="iso-row">
        <span class="iso-chip">ISO 3166-1 α2 <strong>{{ country.cca2 }}</strong></span>
        <span class="iso-chip">α3 <strong>{{ country.cca3 }}</strong></span>
        <span v-if="country.ccn3" class="iso-chip">Numeric <strong>{{ country.ccn3 }}</strong></span>
      </div>

      <div v-if="!gdpEntry && !country.ccn3" class="limited-data">
        Limited data available for this territory.
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.country-panel {
  position: absolute;
  top: 0;
  right: 0;
  width: 300px;
  height: 100%;
  background: var(--color-panel);
  border-left: 1px solid var(--color-border);
  overflow-y: auto;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.panel-slide-enter-active,
.panel-slide-leave-active { transition: transform 0.25s ease; }
.panel-slide-enter-from,
.panel-slide-leave-to  { transform: translateX(100%); }

.panel-header {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 16px;
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  background: var(--color-panel);
  z-index: 1;
}

.flag {
  width: 40px;
  height: 28px;
  object-fit: cover;
  border-radius: 2px;
  flex-shrink: 0;
  border: 1px solid var(--color-border);
}

.title-block { flex: 1; min-width: 0; }

.country-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: 1.2;
}

.official-name {
  font-size: 11px;
  color: var(--color-text-muted);
  margin-top: 2px;
  line-height: 1.3;
}

.close-btn {
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  font-size: 14px;
  padding: 0;
  line-height: 1;
  flex-shrink: 0;
}
.close-btn:hover { color: var(--color-text-primary); }

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  background: var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

.stat {
  padding: 10px 14px;
  background: var(--color-panel);
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.stat-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
  font-weight: 600;
}

.stat-value {
  font-size: 13px;
  color: var(--color-text-primary);
}

.section {
  padding: 12px 14px;
  border-bottom: 1px solid var(--color-border);
}

.section-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
  font-weight: 600;
  margin-bottom: 6px;
}

.tag-list { display: flex; flex-wrap: wrap; gap: 4px; }

.tag {
  font-size: 11px;
  padding: 2px 7px;
  background: var(--color-panel-elevated);
  border: 1px solid var(--color-border);
  border-radius: 3px;
  color: var(--color-text-secondary);
}

.iso-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 12px 14px;
  border-bottom: 1px solid var(--color-border);
}

.iso-chip {
  font-size: 10px;
  color: var(--color-text-muted);
}

.iso-chip strong {
  color: var(--color-text-secondary);
  font-family: var(--font-mono);
}

.limited-data {
  padding: 12px 14px;
  font-size: 12px;
  color: var(--color-text-muted);
  font-style: italic;
}

.mono { font-family: var(--font-mono); font-variant-numeric: tabular-nums; }
</style>
