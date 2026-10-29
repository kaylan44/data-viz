<script setup lang="ts">
import { ref, computed } from 'vue'
import type { DashboardConfig } from './dashboardTypes'
import { useLiveQuotes } from '@/composables/useLiveQuotes'
import { useTickLog } from '@/composables/useTickLog'
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
import TickLog from '@/components/data/TickLog.vue'
import LineChartPanel from '@/components/charts/LineChartPanel.vue'
import type { TimeRange } from '@/types'

const props = defineProps<{ config: DashboardConfig }>()

const store = useMarketStore()
const range = ref<TimeRange>(props.config.defaultRange)
const activeGroupId = ref(props.config.groups?.[0]?.id ?? '')

const { quotes } = useLiveQuotes(props.config.instrumentIds)
const { ticks } = useTickLog(props.config.instrumentIds, 20)

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
  <div class="dashboard">
    <!-- Left: table -->
    <Panel :no-pad="true" class="dashboard-table">
      <PanelHeader :title="config.title">
        <template #actions>
          <LiveBadge />
          <SegmentedControl
            v-if="config.groups"
            v-model="activeGroupId"
            :options="groupOptions"
          />
        </template>
      </PanelHeader>
      <div class="table-scroll">
        <!-- Flat table -->
        <template v-if="!config.groups">
          <DataTable :columns="cols" :rows="allRows" :row-key="(r) => r.id" :sticky-header="true">
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
            <DataTable :columns="cols" :rows="rowsForGroup(group.id)" :row-key="(r) => r.id">
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

    <!-- Right bottom: tick log -->
    <Panel :no-pad="true" class="dashboard-ticklog">
      <PanelHeader title="Tick Log" subtitle="live feed" />
      <div class="ticklog-scroll"><TickLog :ticks="ticks" /></div>
    </Panel>
  </div>
</template>

<style scoped>
.dashboard {
  display: grid;
  grid-template-columns: 390px 1fr;
  grid-template-rows: 1fr 180px;
  grid-template-areas: "table chart" "table ticklog";
  gap: 12px;
  height: calc(100vh - 52px - 40px);
  min-height: 560px;
}

.dashboard-table  { grid-area: table; display: flex; flex-direction: column; overflow: hidden; }
.dashboard-chart  { grid-area: chart; }
.dashboard-ticklog{ grid-area: ticklog; display: flex; flex-direction: column; overflow: hidden; }

.table-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.ticklog-scroll {
  flex: 1;
  overflow-y: auto;
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
</style>
