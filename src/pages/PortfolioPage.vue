<script setup lang="ts">
import { ref, computed } from 'vue'
import AppShell from '@/app/AppShell.vue'
import Panel from '@/components/ui/Panel.vue'
import PanelHeader from '@/components/ui/PanelHeader.vue'
import LineChartPanel from '@/components/charts/LineChartPanel.vue'
import DonutChart from '@/components/charts/DonutChart.vue'
import LiveBadge from '@/components/ui/LiveBadge.vue'
import type { TimeRange } from '@/types'
import { usePortfolio } from '@/composables/usePortfolio'
import { useLiveQuotes } from '@/composables/useLiveQuotes'
import { equities } from '@/data/catalog/equities'

const range = ref<TimeRange>('1Y')
const { portfolioSeries, benchmarkSeries, kpis, donutSlices } = usePortfolio(range)
const { quotes } = useLiveQuotes(equities.map((e) => e.id))

const chartSeries = computed(() => [
  { id: 'portfolio', name: 'Portfolio', points: portfolioSeries.value },
  { id: 'benchmark', name: 'S&P 500 (sim.)', points: benchmarkSeries.value },
])

function fmtBillions(v: number): string {
  return `$${(v / 1_000_000_000).toFixed(2)}B`
}

function fmtPct(v: number, sign = true): string {
  return `${sign && v > 0 ? '+' : ''}${(v * 100).toFixed(2)}%`
}

function fmtPctShort(v: number): string {
  return `${v > 0 ? '+' : ''}${(v * 100).toFixed(1)}%`
}

const bestSymbol = computed(() => {
  const id = kpis.value.bestPerformerId
  return equities.find((e) => e.id === id)?.symbol ?? id
})

/** Current live price of best performer */
const bestLast = computed(() => {
  const id = kpis.value.bestPerformerId
  return quotes.value.get(id)?.last
})
</script>

<template>
  <AppShell>
    <div class="portfolio-page">

      <!-- Page header -->
      <div class="page-header">
        <span class="page-title">Mag 7 Portfolio</span>
        <LiveBadge />
      </div>

      <!-- KPI tiles row -->
      <div class="kpi-row">

        <!-- Portfolio Value -->
        <Panel class="kpi-tile">
          <PanelHeader title="Portfolio Value" />
          <div class="kpi-body">
            <div class="kpi-primary">{{ fmtBillions(kpis.portfolioValue) }}</div>
            <div class="kpi-sub" :class="kpis.portfolioValueChange >= 0 ? 'pos' : 'neg'">
              {{ kpis.portfolioValueChange >= 0 ? '+' : '' }}{{ fmtBillions(kpis.portfolioValueChange) }}
              <span class="kpi-hint">vs base</span>
            </div>
          </div>
        </Panel>

        <!-- YTD Return -->
        <Panel class="kpi-tile">
          <PanelHeader :title="`Return (${range})`" />
          <div class="kpi-body">
            <div class="kpi-primary" :class="kpis.ytdReturn >= 0 ? 'pos' : 'neg'">
              {{ fmtPct(kpis.ytdReturn) }}
            </div>
            <div class="kpi-sub" :class="kpis.ytdReturnVsBenchmark >= 0 ? 'pos' : 'neg'">
              {{ fmtPctShort(kpis.ytdReturnVsBenchmark) }} vs S&P 500
            </div>
          </div>
        </Panel>

        <!-- Volatility -->
        <Panel class="kpi-tile">
          <PanelHeader title="Portfolio Volatility" />
          <div class="kpi-body">
            <div class="kpi-primary">{{ fmtPct(kpis.weightedVol, false) }}</div>
            <div class="kpi-sub neutral">Annualized weighted vol</div>
          </div>
        </Panel>

        <!-- Best Performer -->
        <Panel class="kpi-tile">
          <PanelHeader title="Best Performer" />
          <div class="kpi-body">
            <div class="kpi-primary kpi-ticker">
              <span class="ticker-symbol">{{ bestSymbol }}</span>
              <span class="kpi-pct pos">{{ fmtPctShort(kpis.bestPerformerReturn) }}</span>
            </div>
            <div class="kpi-sub neutral">
              {{ bestLast != null ? `$${bestLast.toFixed(2)}` : '—' }} live
            </div>
          </div>
        </Panel>

      </div>

      <!-- Main content: chart + donut -->
      <div class="main-row">
        <div class="chart-col">
          <LineChartPanel
            title="Cumulative Performance"
            :series="chartSeries"
            mode="normalized100"
            :range="range"
            @update:range="range = $event"
          />
        </div>
        <div class="donut-col">
          <DonutChart
            title="Asset Allocation"
            :slices="donutSlices"
            center-label="PORTFOLIO"
            center-value="$3.84B"
          />
        </div>
      </div>

    </div>
  </AppShell>
</template>

<style scoped>
.portfolio-page {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px;
  height: 100%;
  min-height: 0;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.page-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-primary);
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

/* KPI row */
.kpi-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  flex-shrink: 0;
}

.kpi-tile {
  display: flex;
  flex-direction: column;
}

.kpi-body {
  padding: 10px 14px 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.kpi-primary {
  font-family: 'JetBrains Mono', monospace;
  font-size: 22px;
  font-weight: 700;
  color: var(--color-text-primary);
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
}

.kpi-ticker {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.ticker-symbol {
  font-size: 20px;
}

.kpi-pct {
  font-size: 15px;
}

.kpi-sub {
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  display: flex;
  align-items: center;
  gap: 5px;
}

.kpi-hint {
  color: var(--color-text-muted);
  font-size: 10px;
}

.pos { color: var(--color-positive); }
.neg { color: var(--color-negative); }
.neutral { color: var(--color-text-secondary); }

/* Main row */
.main-row {
  display: flex;
  gap: 10px;
  flex: 1;
  min-height: 0;
}

.chart-col {
  flex: 6;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.donut-col {
  flex: 4;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
</style>
