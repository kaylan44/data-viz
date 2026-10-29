<script setup lang="ts">
import { computed, ref } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  DataZoomInsideComponent,
  LegendComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'
import type { Point, ChartMode } from '@/types'
import Panel from '@/components/ui/Panel.vue'
import PanelHeader from '@/components/ui/PanelHeader.vue'
import TimeRangeSelector from './TimeRangeSelector.vue'
import type { TimeRange } from '@/types'
import IconButton from '@/components/ui/IconButton.vue'
import { RotateCcw } from '@lucide/vue'

use([CanvasRenderer, LineChart, GridComponent, TooltipComponent, DataZoomInsideComponent, LegendComponent])

export interface ChartSeries {
  id: string
  name: string
  points: Point[]
}

const SERIES_COLORS = [
  '#60A5FA', '#F5B800', '#A78BFA', '#34D399',
  '#FB923C', '#F472B6', '#38BDF8', '#A3E635',
]

const AXIS_COLOR = '#1E2736'
const LABEL_COLOR = '#5B667A'
const TOOLTIP_BG = '#141B28'
const TOOLTIP_BORDER = '#1E2736'

const props = withDefaults(
  defineProps<{
    series: ChartSeries[]
    mode?: ChartMode
    title?: string
    range: TimeRange
  }>(),
  { mode: 'absolute' },
)

const emit = defineEmits<{ 'update:range': [value: TimeRange] }>()

const chartRef = ref<InstanceType<typeof VChart>>()

function resetZoom() {
  chartRef.value?.dispatchAction({ type: 'dataZoom', start: 0, end: 100 })
}

const activeSeries = computed(() => {
  if (props.mode !== 'normalized100') return props.series
  return props.series.map((s) => {
    const base = s.points[0]?.v ?? 1
    return {
      ...s,
      points: s.points.map((p) => ({ t: p.t, v: (p.v / base) * 100 })),
    }
  })
})

const option = computed(() => ({
  animation: false,
  backgroundColor: 'transparent',
  grid: { top: 12, right: 16, bottom: 36, left: 56 },
  xAxis: {
    type: 'time',
    axisLine: { lineStyle: { color: AXIS_COLOR } },
    splitLine: { lineStyle: { color: AXIS_COLOR } },
    axisLabel: { color: LABEL_COLOR, fontSize: 10 },
    axisTick: { lineStyle: { color: AXIS_COLOR } },
  },
  yAxis: {
    type: 'value',
    axisLine: { show: false },
    splitLine: { lineStyle: { color: AXIS_COLOR } },
    axisLabel: {
      color: LABEL_COLOR,
      fontSize: 10,
      formatter: (v: number) =>
        props.mode === 'normalized100' ? v.toFixed(0) : v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v.toFixed(2),
    },
  },
  legend: {
    show: activeSeries.value.length > 1,
    bottom: 0,
    textStyle: { color: LABEL_COLOR, fontSize: 10 },
    itemWidth: 12,
    itemHeight: 2,
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: TOOLTIP_BG,
    borderColor: TOOLTIP_BORDER,
    borderWidth: 1,
    textStyle: { color: '#E6EAF2', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' },
    axisPointer: { lineStyle: { color: AXIS_COLOR } },
  },
  dataZoom: [{ type: 'inside', filterMode: 'filter' }],
  series: activeSeries.value.map((s, i) => ({
    type: 'line',
    name: s.name,
    data: s.points.map((p) => [p.t, p.v]),
    color: SERIES_COLORS[i % SERIES_COLORS.length],
    lineStyle: { width: 1.5 },
    symbol: 'none',
    smooth: false,
    areaStyle:
      activeSeries.value.length === 1
        ? {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: `${SERIES_COLORS[0]}28` },
                { offset: 1, color: `${SERIES_COLORS[0]}00` },
              ],
            },
          }
        : undefined,
  })),
}))
</script>

<template>
  <Panel :no-pad="true" style="display: flex; flex-direction: column; flex: 1;">
    <PanelHeader :title="title ?? 'Chart'">
      <template #actions>
        <TimeRangeSelector :model-value="range" @update:model-value="emit('update:range', $event)" />
        <IconButton label="Reset zoom" size="sm" @click="resetZoom">
          <RotateCcw :size="13" />
        </IconButton>
      </template>
    </PanelHeader>
    <div class="chart-area">
      <VChart ref="chartRef" :option="option" autoresize />
    </div>
  </Panel>
</template>

<style scoped>
.chart-area {
  flex: 1;
  min-height: 0;
  padding: 8px 0 4px;
}

.chart-area :deep(.echarts) {
  width: 100% !important;
  height: 100% !important;
}
</style>
