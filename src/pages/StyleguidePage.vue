<script setup lang="ts">
import { ref, computed } from 'vue'
import AppShell from '@/app/AppShell.vue'
import { useLiveQuotes } from '@/composables/useLiveQuotes'
import { useHistory } from '@/composables/useHistory'
import { useTickLog } from '@/composables/useTickLog'
import { ALL_INSTRUMENTS } from '@/data/catalog'
import { equities } from '@/data/catalog'
import Panel from '@/components/ui/Panel.vue'
import PanelHeader from '@/components/ui/PanelHeader.vue'
import SegmentedControl from '@/components/ui/SegmentedControl.vue'
import Badge from '@/components/ui/Badge.vue'
import LiveBadge from '@/components/ui/LiveBadge.vue'
import IconButton from '@/components/ui/IconButton.vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import StateMessage from '@/components/ui/StateMessage.vue'
import Sparkline from '@/components/data/Sparkline.vue'
import PriceChange from '@/components/data/PriceChange.vue'
import FlashValue from '@/components/data/FlashValue.vue'
import DataTable from '@/components/data/DataTable.vue'
import TickLog from '@/components/data/TickLog.vue'
import LineChartPanel from '@/components/charts/LineChartPanel.vue'
import type { TableColumn } from '@/components/data/types'
import type { TimeRange } from '@/types'
import { ZoomIn, ZoomOut, RotateCcw, Settings } from '@lucide/vue'

// Stage 2 debug (kept)
const debugIds = ALL_INSTRUMENTS.slice(0, 10).map((i) => i.id)
const { quotes } = useLiveQuotes(debugIds)
const debugRows = computed(() =>
  debugIds.map((id) => {
    const inst = ALL_INSTRUMENTS.find((i) => i.id === id)!
    const q = quotes.value.get(id)
    return { inst, q }
  }),
)

const range = ref<TimeRange>('1D')
const rangeOptions = [
  { value: '1D' as const, label: '1D' },
  { value: '5D' as const, label: '5D' },
  { value: '1M' as const, label: '1M' },
  { value: '3M' as const, label: '3M' },
  { value: '1Y' as const, label: '1Y' },
]

// --- Stage 3 showcase ---

// All 30 instruments live (DataTable stress test)
const allIds = ALL_INSTRUMENTS.map((i) => i.id)
const { quotes: allQuotes } = useLiveQuotes(allIds)

interface TableRow extends Record<string, unknown> {
  id: string
  symbol: string
  name: string
  last: number
  change: number
  changePct: number
  dayLow: number
  dayHigh: number
  sparkValues: number[]
  ts: number
  decimals: number
}

const tableRows = computed<TableRow[]>(() =>
  ALL_INSTRUMENTS.map((inst) => {
    const q = allQuotes.value.get(inst.id)
    const history = useHistory(inst.id, range).history.value
    return {
      id: inst.id,
      symbol: inst.symbol,
      name: inst.name,
      last: q?.last ?? inst.basePrice,
      change: q?.change ?? 0,
      changePct: q?.changePct ?? 0,
      dayLow: q?.dayLow ?? inst.basePrice,
      dayHigh: q?.dayHigh ?? inst.basePrice,
      sparkValues: history.slice(-40).map((p) => p.v),
      ts: q?.ts ?? 0,
      decimals: inst.decimals,
    }
  }),
)

const tableCols: TableColumn<TableRow>[] = [
  { key: 'symbol', label: 'Symbol', width: '72px' },
  { key: 'name', label: 'Name', width: '160px' },
  { key: 'sparkValues', label: '24h', align: 'center', width: '88px' },
  { key: 'last', label: 'Last', align: 'right', width: '88px' },
  { key: 'changePct', label: 'Chg %', align: 'right', width: '80px' },
  { key: 'dayLow', label: 'Low', align: 'right', width: '88px' },
  { key: 'dayHigh', label: 'High', align: 'right', width: '88px' },
  { key: 'ts', label: 'Updated', align: 'right', width: '80px' },
]

// LineChartPanel — Mag 7 normalized100
const chartRange = ref<TimeRange>('1M')
const chartSeries = computed(() =>
  equities.map((inst) => ({
    id: inst.id,
    name: inst.symbol,
    points: useHistory(inst.id, chartRange).history.value,
  })),
)

// TickLog
const { ticks } = useTickLog(allIds, 25)
</script>

<template>
  <AppShell>
    <div class="sg">
      <p class="sg-note">
        Internal style guide — not linked from production navigation.
      </p>

      <!-- Colors -->
      <section class="sg-section">
        <h2 class="sg-heading">Design Tokens</h2>
        <div class="sg-row sg-row--wrap">
          <div class="swatch" style="background: var(--color-canvas)"><span>Canvas</span></div>
          <div class="swatch" style="background: var(--color-panel)"><span>Panel</span></div>
          <div class="swatch" style="background: var(--color-panel-elevated)"><span>Elevated</span></div>
          <div class="swatch swatch--border" style="background: var(--color-border)"><span>Border</span></div>
          <div class="swatch" style="background: var(--color-accent)"><span style="color:#000">Accent</span></div>
          <div class="swatch" style="background: var(--color-positive)"><span>Positive</span></div>
          <div class="swatch" style="background: var(--color-negative)"><span>Negative</span></div>
        </div>
        <div class="sg-row sg-row--wrap" style="margin-top: 8px">
          <div v-for="n in 8" :key="n" class="swatch swatch--sm" :style="`background: var(--color-series-${n})`">
            <span style="color:#000; font-size:10px">S{{ n }}</span>
          </div>
        </div>
      </section>

      <!-- Typography -->
      <section class="sg-section">
        <h2 class="sg-heading">Typography</h2>
        <Panel>
          <div class="sg-type-row"><span class="sg-label">Primary (14px/600)</span><span class="t-primary">The quick brown fox</span></div>
          <div class="sg-type-row"><span class="sg-label">Secondary (13px/400)</span><span class="t-secondary">Market data overview</span></div>
          <div class="sg-type-row"><span class="sg-label">Muted (12px/400)</span><span class="t-muted">Last updated 09:42:17</span></div>
          <div class="sg-type-row"><span class="sg-label">Mono / Ticker</span><span class="t-mono tabular-nums">+1,234.56 (+2.31%)</span></div>
          <div class="sg-type-row"><span class="sg-label">Uppercase header</span><span class="t-header">Symbol</span></div>
        </Panel>
      </section>

      <!-- Badges -->
      <section class="sg-section">
        <h2 class="sg-heading">Badge</h2>
        <div class="sg-row">
          <Badge>Default</Badge>
          <Badge variant="positive">+2.31%</Badge>
          <Badge variant="negative">-1.08%</Badge>
          <Badge variant="accent">New</Badge>
          <Badge variant="muted">Closed</Badge>
        </div>
      </section>

      <!-- LiveBadge -->
      <section class="sg-section">
        <h2 class="sg-heading">LiveBadge</h2>
        <div class="sg-row">
          <LiveBadge />
          <LiveBadge :connected="false" />
        </div>
      </section>

      <!-- SegmentedControl -->
      <section class="sg-section">
        <h2 class="sg-heading">SegmentedControl</h2>
        <SegmentedControl v-model="range" :options="rangeOptions" />
        <p class="sg-note" style="margin-top:8px">Selected: {{ range }}</p>
      </section>

      <!-- IconButton -->
      <section class="sg-section">
        <h2 class="sg-heading">IconButton</h2>
        <div class="sg-row">
          <IconButton label="Zoom in" size="md"><ZoomIn :size="16" /></IconButton>
          <IconButton label="Zoom out" size="md"><ZoomOut :size="16" /></IconButton>
          <IconButton label="Reset" size="md" :active="true"><RotateCcw :size="16" /></IconButton>
          <IconButton label="Settings" size="sm" :disabled="true"><Settings :size="14" /></IconButton>
        </div>
      </section>

      <!-- Panel variants -->
      <section class="sg-section">
        <h2 class="sg-heading">Panel</h2>
        <div class="sg-row sg-row--stretch">
          <Panel style="flex:1">
            <p class="t-secondary" style="margin:0">Default panel</p>
          </Panel>
          <Panel :elevated="true" style="flex:1">
            <p class="t-secondary" style="margin:0">Elevated panel</p>
          </Panel>
          <Panel :no-pad="true" style="flex:1">
            <PanelHeader title="With Header" subtitle="subtitle">
              <template #actions>
                <SegmentedControl v-model="range" :options="rangeOptions" />
              </template>
            </PanelHeader>
            <div style="padding:12px">
              <p class="t-secondary" style="margin:0">Content area</p>
            </div>
          </Panel>
        </div>
      </section>

      <!-- Skeleton -->
      <section class="sg-section">
        <h2 class="sg-heading">Skeleton</h2>
        <Panel style="max-width: 360px">
          <div style="display:flex;flex-direction:column;gap:10px">
            <Skeleton height="16px" width="60%" />
            <Skeleton height="12px" />
            <Skeleton height="12px" width="80%" />
            <Skeleton height="28px" :rounded="true" width="100px" />
          </div>
        </Panel>
      </section>

      <!-- StateMessage -->
      <section class="sg-section">
        <h2 class="sg-heading">StateMessage</h2>
        <div class="sg-row sg-row--stretch">
          <Panel style="flex:1">
            <StateMessage type="empty" title="No data available" description="There is nothing to display here yet." />
          </Panel>
          <Panel style="flex:1">
            <StateMessage
              type="error"
              title="Failed to load"
              description="Could not connect to the data provider."
              @retry="() => {}"
            />
          </Panel>
        </div>
      </section>

      <!-- Data layer debug -->
      <section class="sg-section">
        <h2 class="sg-heading">Data Layer — Live Quotes Debug</h2>
        <Panel :no-pad="true">
          <PanelHeader title="Live Ticks" subtitle="first 10 instruments">
            <template #actions><LiveBadge /></template>
          </PanelHeader>
          <table class="debug-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th class="num">Last</th>
                <th class="num">Chg%</th>
                <th class="num">Low</th>
                <th class="num">High</th>
                <th class="num">Updated</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="{ inst, q } in debugRows" :key="inst.id">
                <td class="mono">{{ inst.symbol }}</td>
                <td>{{ inst.name }}</td>
                <td class="num mono">{{ q ? q.last.toFixed(inst.decimals) : '—' }}</td>
                <td class="num mono" :class="q && q.changePct >= 0 ? 'pos' : 'neg'">
                  {{ q ? (q.changePct * 100).toFixed(2) + '%' : '—' }}
                </td>
                <td class="num mono muted">{{ q ? q.dayLow.toFixed(inst.decimals) : '—' }}</td>
                <td class="num mono muted">{{ q ? q.dayHigh.toFixed(inst.decimals) : '—' }}</td>
                <td class="num mono muted">{{ q ? new Date(q.ts).toISOString().slice(11, 19) : '—' }}</td>
              </tr>
            </tbody>
          </table>
        </Panel>
      </section>

      <!-- Stage 3: Sparkline -->
      <section class="sg-section">
        <h2 class="sg-heading">Sparkline</h2>
        <div class="sg-row">
          <Sparkline :values="[10,12,11,14,13,16,15,18,17,20]" />
          <Sparkline :values="[20,18,17,19,16,15,13,14,12,10]" />
          <Sparkline :values="[10,10,10,10,10,10,10,10,10,10]" />
          <Sparkline
            :values="tableRows[0]?.sparkValues ?? []"
            :width="120"
          />
        </div>
      </section>

      <!-- Stage 3: PriceChange + FlashValue -->
      <section class="sg-section">
        <h2 class="sg-heading">PriceChange + FlashValue</h2>
        <div class="sg-row">
          <PriceChange :change="12.34" :change-pct="0.0231" :show-absolute="true" />
          <PriceChange :change="-8.92" :change-pct="-0.0108" :show-absolute="true" />
          <PriceChange :change="0" :change-pct="0" />
          <FlashValue :value="tableRows[0]?.last ?? 0">
            <span class="mono" style="color: var(--color-text-primary)">
              {{ tableRows[0]?.last.toFixed(2) }}
            </span>
          </FlashValue>
        </div>
      </section>

      <!-- Stage 3: DataTable (30 instruments live) -->
      <section class="sg-section">
        <h2 class="sg-heading">DataTable — 30 instruments live</h2>
        <Panel :no-pad="true" style="max-height: 420px; overflow: hidden; display: flex; flex-direction: column;">
          <PanelHeader title="All Instruments" subtitle="30 rows">
            <template #actions><LiveBadge /></template>
          </PanelHeader>
          <div style="overflow-y: auto; flex: 1;">
            <DataTable :columns="tableCols" :rows="tableRows" :row-key="r => r.id" :sticky-header="true">
              <template #cell-symbol="{ row }">
                <span class="mono" style="color: var(--color-text-primary); font-weight: 600;">{{ row.symbol }}</span>
              </template>
              <template #cell-sparkValues="{ row }">
                <Sparkline :values="(row.sparkValues as number[])" :width="72" :height="20" />
              </template>
              <template #cell-last="{ row }">
                <FlashValue :value="(row.last as number)">
                  <span class="mono">{{ (row.last as number).toFixed(row.decimals as number) }}</span>
                </FlashValue>
              </template>
              <template #cell-changePct="{ row }">
                <PriceChange :change="(row.change as number)" :change-pct="(row.changePct as number)" />
              </template>
              <template #cell-dayLow="{ row }">
                <span class="mono muted">{{ (row.dayLow as number).toFixed(row.decimals as number) }}</span>
              </template>
              <template #cell-dayHigh="{ row }">
                <span class="mono muted">{{ (row.dayHigh as number).toFixed(row.decimals as number) }}</span>
              </template>
              <template #cell-ts="{ row }">
                <span class="mono muted">{{ row.ts ? new Date(row.ts as number).toISOString().slice(11,19) : '—' }}</span>
              </template>
            </DataTable>
          </div>
        </Panel>
      </section>

      <!-- Stage 3: LineChartPanel -->
      <section class="sg-section">
        <h2 class="sg-heading">LineChartPanel — Mag 7 normalized</h2>
        <div style="height: 320px; display: flex; flex-direction: column;">
          <LineChartPanel
            title="Magnificent 7"
            :series="chartSeries"
            mode="normalized100"
            :range="chartRange"
            @update:range="chartRange = $event"
          />
        </div>
      </section>

      <!-- Stage 3: TickLog -->
      <section class="sg-section">
        <h2 class="sg-heading">TickLog</h2>
        <Panel :no-pad="true" style="max-height: 280px; overflow: hidden;">
          <PanelHeader title="Recent Ticks" subtitle="newest first">
            <template #actions><LiveBadge /></template>
          </PanelHeader>
          <div style="overflow-y: auto; max-height: 232px;">
            <TickLog :ticks="ticks" />
          </div>
        </Panel>
      </section>
    </div>
  </AppShell>
</template>

<style scoped>
.sg {
  display: flex;
  flex-direction: column;
  gap: 32px;
  max-width: 1200px;
}

.sg-heading {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  margin: 0 0 12px;
}

.sg-section {
  display: flex;
  flex-direction: column;
}

.sg-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sg-row--wrap { flex-wrap: wrap; }
.sg-row--stretch { align-items: stretch; }

.sg-note {
  font-size: 12px;
  color: var(--color-text-muted);
  margin: 0;
}

/* Swatches */
.swatch {
  width: 72px;
  height: 48px;
  border-radius: var(--radius-panel);
  display: flex;
  align-items: flex-end;
  padding: 4px 6px;
  border: 1px solid var(--color-border);
}

.swatch--sm {
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
  padding: 0;
}

.swatch--border {
  border-color: var(--color-text-muted);
}

.swatch span {
  font-size: 10px;
  color: var(--color-text-secondary);
}

/* Typography samples */
.sg-type-row {
  display: flex;
  align-items: baseline;
  gap: 24px;
  padding: 8px 0;
  border-bottom: 1px solid var(--color-border);
}

.sg-type-row:last-child {
  border-bottom: none;
}

.sg-label {
  font-size: 11px;
  color: var(--color-text-muted);
  width: 180px;
  flex-shrink: 0;
}

.t-primary { font-size: 14px; font-weight: 600; color: var(--color-text-primary); }
.t-secondary { font-size: 13px; color: var(--color-text-secondary); }
.t-muted { font-size: 12px; color: var(--color-text-muted); }
.t-mono { font-family: var(--font-mono); font-size: 13px; color: var(--color-text-primary); }
.t-header {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-secondary);
}

/* Debug table */
.debug-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.debug-table th {
  padding: 7px 12px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}

.debug-table th.num,
.debug-table td.num { text-align: right; }

.debug-table td {
  padding: 7px 12px;
  color: var(--color-text-secondary);
  border-bottom: 1px solid color-mix(in srgb, var(--color-border) 50%, transparent);
}

.debug-table tr:last-child td { border-bottom: none; }
.debug-table tr:hover td { background-color: var(--color-panel-elevated); }

.mono { font-family: var(--font-mono); font-variant-numeric: tabular-nums; }
.pos { color: var(--color-positive); }
.neg { color: var(--color-negative); }
.muted { color: var(--color-text-muted); }
</style>
