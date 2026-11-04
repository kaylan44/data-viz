<script setup lang="ts">
import { ref, computed } from 'vue'
import type { DashboardConfig } from './dashboardTypes'
import { useLiveQuotes } from '@/composables/useLiveQuotes'

import { useMarketStore } from '@/stores/market'
import { INSTRUMENT_MAP } from '@/data/catalog'
import type { TableColumn } from '@/components/data/types'
import Panel from '@/components/ui/Panel.vue'
import PanelHeader from '@/components/ui/PanelHeader.vue'
import SegmentedControl from '@/components/ui/SegmentedControl.vue'
import LiveBadge from '@/components/ui/LiveBadge.vue'
import DataTable from '@/components/data/DataTable.vue'
import Sparkline from '@/components/data/Sparkline.vue'
import PriceChange from '@/components/data/PriceChange.vue'
import FlashValue from '@/components/data/FlashValue.vue'

import LineChartPanel from '@/components/charts/LineChartPanel.vue'
import type { TimeRange } from '@/types'

const props = defineProps<{ config: DashboardConfig; compact?: boolean }>()

// Row detail popover
const selectedRow = ref<DashboardRow | null>(null)
const popoverAnchor = ref<{ x: number; y: number } | null>(null)

function openDetail(row: DashboardRow, event: MouseEvent) {
  selectedRow.value = row
  popoverAnchor.value = { x: event.clientX, y: event.clientY }
}

function closeDetail() {
  selectedRow.value = null
  popoverAnchor.value = null
}

const store = useMarketStore()
const range = ref<TimeRange>(props.config.defaultRange)
const activeGroupId = ref(props.config.groups?.[0]?.id ?? '')

const { quotes } = useLiveQuotes(props.config.instrumentIds)

interface DashboardRow extends Record<string, unknown> {
  id: string; symbol: string; name: string
  last: number; change: number; changePct: number
  dayLow: number; dayHigh: number; sparkValues: number[]
  ts: number; decimals: number
}

function buildRow(id: string): DashboardRow {
  const inst = INSTRUMENT_MAP.get(id)!
  const q = quotes.value.get(id)
  return {
    id, symbol: inst.symbol, name: inst.name,
    last: q?.last ?? inst.basePrice,
    change: q?.change ?? 0,
    changePct: q?.changePct ?? 0,
    dayLow: q?.dayLow ?? inst.basePrice,
    dayHigh: q?.dayHigh ?? inst.basePrice,
    sparkValues: store.getHistory(id, '1D').slice(-40).map((p) => p.v),
    ts: q?.ts ?? 0,
    decimals: inst.decimals,
  }
}

const allRows = computed<DashboardRow[]>(() =>
  props.config.instrumentIds.map(buildRow),
)

function rowsForGroup(groupId: string): DashboardRow[] {
  const ids = new Set(props.config.groups?.find((g) => g.id === groupId)?.instrumentIds ?? [])
  return allRows.value.filter((r) => ids.has(r.id))
}

const chartSeries = computed(() => {
  const ids = props.config.groups
    ? (props.config.groups.find((g) => g.id === activeGroupId.value)?.instrumentIds ?? props.config.instrumentIds)
    : props.config.instrumentIds
  return ids.map((id) => ({
    id,
    name: INSTRUMENT_MAP.get(id)!.symbol,
    points: store.getHistory(id, range.value),
  }))
})

const groupOptions = computed(() =>
  (props.config.groups ?? []).map((g) => ({ value: g.id, label: g.label })),
)

const cols: TableColumn<DashboardRow>[] = [
  { key: 'symbol', label: 'Symbol', width: '68px' },
  { key: 'name', label: 'Name', width: '140px' },
  { key: 'sparkValues', label: '24h', align: 'center', width: '84px' },
  { key: 'last', label: 'Last', align: 'right', width: '90px' },
  { key: 'changePct', label: 'Chg %', align: 'right', width: '80px' },
  { key: 'dayLow', label: 'Low', align: 'right', width: '80px' },
  { key: 'dayHigh', label: 'High', align: 'right', width: '80px' },
  { key: 'ts', label: 'Updated', align: 'right', width: '76px' },
]

function fmtNum(v: number, dec: number) { return v.toFixed(dec) }
function fmtTime(ts: number) { return ts ? new Date(ts).toISOString().slice(11, 19) : '—' }
</script>

<template>
  <div class="dashboard" :class="{ 'dashboard--grouped': config.groups, 'dashboard--compact': compact }">
    <!-- Top bar (grouped dashboards only) -->
    <div v-if="config.groups" class="dashboard-topbar">
      <div class="dashboard-topbar-left">
        <LiveBadge />
        <span class="dashboard-topbar-title">{{ config.title }}</span>
      </div>
      <SegmentedControl v-model="activeGroupId" :options="groupOptions" />
    </div>

    <!-- Left: table -->
    <Panel :no-pad="true" class="dashboard-table">
      <PanelHeader :title="config.title">
        <template v-if="!config.groups" #actions>
          <LiveBadge />
        </template>
      </PanelHeader>
      <div class="table-scroll">
        <!-- Flat table -->
        <template v-if="!config.groups">
          <DataTable :columns="cols" :rows="allRows" :row-key="(r) => r.id" :sticky-header="true" @row-click="(row, ev) => openDetail(row as DashboardRow, ev)">
            <template #cell-symbol="{ row }"><span class="sym">{{ row.symbol }}</span></template>
            <template #cell-sparkValues="{ row }"><Sparkline :values="(row.sparkValues as number[])" :width="72" :height="20" /></template>
            <template #cell-last="{ row }">
              <FlashValue :value="(row.last as number)"><span class="mono">{{ fmtNum(row.last as number, row.decimals as number) }}</span></FlashValue>
            </template>
            <template #cell-changePct="{ row }"><PriceChange :change="(row.change as number)" :change-pct="(row.changePct as number)" /></template>
            <template #cell-dayLow="{ row }"><span class="mono muted">{{ fmtNum(row.dayLow as number, row.decimals as number) }}</span></template>
            <template #cell-dayHigh="{ row }"><span class="mono muted">{{ fmtNum(row.dayHigh as number, row.decimals as number) }}</span></template>
            <template #cell-ts="{ row }"><span class="mono muted">{{ fmtTime(row.ts as number) }}</span></template>
          </DataTable>
        </template>
        <!-- Grouped table (Overview) -->
        <template v-else>
          <template v-for="group in config.groups" :key="group.id">
            <div class="group-header">{{ group.label }}</div>
            <DataTable :columns="cols" :rows="rowsForGroup(group.id)" :row-key="(r) => r.id" @row-click="(row, ev) => openDetail(row as DashboardRow, ev)">
              <template #cell-symbol="{ row }"><span class="sym">{{ row.symbol }}</span></template>
              <template #cell-sparkValues="{ row }"><Sparkline :values="(row.sparkValues as number[])" :width="72" :height="20" /></template>
              <template #cell-last="{ row }">
                <FlashValue :value="(row.last as number)"><span class="mono">{{ fmtNum(row.last as number, row.decimals as number) }}</span></FlashValue>
              </template>
              <template #cell-changePct="{ row }"><PriceChange :change="(row.change as number)" :change-pct="(row.changePct as number)" /></template>
              <template #cell-dayLow="{ row }"><span class="mono muted">{{ fmtNum(row.dayLow as number, row.decimals as number) }}</span></template>
              <template #cell-dayHigh="{ row }"><span class="mono muted">{{ fmtNum(row.dayHigh as number, row.decimals as number) }}</span></template>
              <template #cell-ts="{ row }"><span class="mono muted">{{ fmtTime(row.ts as number) }}</span></template>
            </DataTable>
          </template>
        </template>
      </div>
    </Panel>

    <!-- Right: chart -->
    <LineChartPanel
      class="dashboard-chart"
      :title="config.title"
      :series="chartSeries"
      :mode="config.chartMode"
      :range="range"
      @update:range="range = $event"
    />

    <!-- Row detail popover -->
    <Teleport to="body">
      <Transition name="popover">
        <div
          v-if="selectedRow && popoverAnchor"
          class="row-popover"
          :style="{ left: `${popoverAnchor.x + 12}px`, top: `${popoverAnchor.y - 8}px` }"
          @click.stop
        >
          <div class="rp-header">
            <span class="rp-symbol">{{ selectedRow.symbol }}</span>
            <span class="rp-name">{{ selectedRow.name }}</span>
            <button class="rp-close" @click="closeDetail">✕</button>
          </div>
          <div class="rp-grid">
            <div class="rp-item">
              <span class="rp-label">Last</span>
              <span class="rp-value mono">{{ fmtNum(selectedRow.last, selectedRow.decimals) }}</span>
            </div>
            <div class="rp-item">
              <span class="rp-label">Change</span>
              <span class="rp-value" :class="selectedRow.change >= 0 ? 'pos' : 'neg'">
                {{ selectedRow.change >= 0 ? '+' : '' }}{{ fmtNum(selectedRow.change, selectedRow.decimals) }}
                ({{ selectedRow.changePct >= 0 ? '+' : '' }}{{ selectedRow.changePct.toFixed(2) }}%)
              </span>
            </div>
            <div class="rp-item">
              <span class="rp-label">Day Low</span>
              <span class="rp-value mono">{{ fmtNum(selectedRow.dayLow, selectedRow.decimals) }}</span>
            </div>
            <div class="rp-item">
              <span class="rp-label">Day High</span>
              <span class="rp-value mono">{{ fmtNum(selectedRow.dayHigh, selectedRow.decimals) }}</span>
            </div>
            <div class="rp-item rp-item--full">
              <span class="rp-label">Updated</span>
              <span class="rp-value mono">{{ fmtTime(selectedRow.ts) }}</span>
            </div>
          </div>
        </div>
      </Transition>
      <div v-if="selectedRow" class="popover-backdrop" @click="closeDetail" />
    </Teleport>
  </div>
</template>

<style scoped>
.dashboard {
  display: grid;
  grid-template-columns: 390px 1fr;
  grid-template-areas: "table chart";
  gap: 12px;
  height: calc(100vh - 52px - 40px);
  min-height: 560px;
}

.dashboard--compact {
  height: 100%;
  min-height: 280px;
}

.dashboard--grouped {
  grid-template-rows: auto 1fr;
  grid-template-areas: "topbar topbar" "table chart";
}

.dashboard-topbar {
  grid-area: topbar;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px;
}

.dashboard-topbar-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dashboard-topbar-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-secondary);
}

.dashboard-table { grid-area: table; display: flex; flex-direction: column; overflow: hidden; }
.dashboard-chart { grid-area: chart; }

.table-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.group-header {
  padding: 6px 12px 4px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  background-color: var(--color-panel);
  border-top: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 1;
}

.group-header:first-child { border-top: none; }

.sym { font-family: var(--font-mono); font-weight: 600; color: var(--color-text-primary); font-size: 11px; }
.mono { font-family: var(--font-mono); font-variant-numeric: tabular-nums; font-size: 11px; }
.muted { color: var(--color-text-muted); }

/* Row detail popover — rendered via Teleport, so not scoped */
</style>

<style>
.row-popover {
  position: fixed;
  z-index: 1000;
  width: 280px;
  background: var(--color-panel-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-panel);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  pointer-events: all;
}

.rp-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-panel);
}

.rp-symbol {
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 13px;
  color: var(--color-accent);
}

.rp-name {
  flex: 1;
  font-size: 12px;
  color: var(--color-text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rp-close {
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  font-size: 12px;
  padding: 0;
  line-height: 1;
  flex-shrink: 0;
}
.rp-close:hover { color: var(--color-text-primary); }

.rp-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  background: var(--color-border);
}

.rp-item {
  background: var(--color-panel-elevated);
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.rp-item--full { grid-column: 1 / -1; }

.rp-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
  font-weight: 600;
}

.rp-value {
  font-size: 13px;
  color: var(--color-text-primary);
}

.rp-value.pos { color: var(--color-positive); }
.rp-value.neg { color: var(--color-negative); }

.popover-backdrop {
  position: fixed;
  inset: 0;
  z-index: 999;
}

.popover-enter-active, .popover-leave-active { transition: opacity 0.15s, transform 0.15s; }
.popover-enter-from, .popover-leave-to { opacity: 0; transform: scale(0.95) translateY(-4px); }
</style>
