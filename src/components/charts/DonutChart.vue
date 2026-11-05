<script setup lang="ts">
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import Panel from '@/components/ui/Panel.vue'
import PanelHeader from '@/components/ui/PanelHeader.vue'
import type { DonutSlice } from '@/composables/usePortfolio'

use([CanvasRenderer, PieChart, TooltipComponent, LegendComponent])

const props = defineProps<{
  slices: DonutSlice[]
  title?: string
  centerLabel?: string
  centerValue?: string
}>()

const TOOLTIP_BG = '#141B28'
const TOOLTIP_BORDER = '#1E2736'
const LABEL_COLOR = '#5B667A'

const option = computed(() => ({
  animation: false,
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'item',
    backgroundColor: TOOLTIP_BG,
    borderColor: TOOLTIP_BORDER,
    borderWidth: 1,
    textStyle: { color: '#E6EAF2', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' },
    formatter: (p: { name: string; value: number; marker: string }) =>
      `${p.marker} ${p.name}: <b>${(p.value * 100).toFixed(1)}%</b>`,
  },
  legend: {
    orient: 'vertical',
    right: 8,
    top: 'middle',
    textStyle: { color: LABEL_COLOR, fontSize: 11, fontFamily: 'JetBrains Mono, monospace' },
    itemWidth: 8,
    itemHeight: 8,
    itemGap: 10,
    formatter: (name: string) => {
      const s = props.slices.find((sl) => sl.name === name)
      return `${s?.symbol ?? name}   ${((s?.weight ?? 0) * 100).toFixed(0)}%`
    },
  },
  series: [{
    type: 'pie',
    radius: ['44%', '70%'],
    center: ['36%', '50%'],
    data: props.slices.map((s) => ({
      name: s.name,
      value: s.weight,
      itemStyle: { color: s.color, borderColor: '#0A0E14', borderWidth: 2 },
    })),
    label: { show: false },
    emphasis: { itemStyle: { shadowBlur: 6, shadowColor: 'rgba(0,0,0,0.4)' } },
  }],
}))
</script>

<template>
  <Panel :no-pad="true" class="donut-panel">
    <PanelHeader :title="title ?? 'Allocation'" />
    <div class="donut-wrap">
      <VChart :option="option" autoresize />
      <div v-if="centerValue" class="donut-center">
        <div class="center-value">{{ centerValue }}</div>
        <div class="center-label">{{ centerLabel }}</div>
      </div>
    </div>
  </Panel>
</template>

<style scoped>
.donut-panel {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.donut-wrap {
  flex: 1;
  min-height: 0;
  position: relative;
}

.donut-wrap :deep(.echarts) {
  width: 100% !important;
  height: 100% !important;
}

.donut-center {
  position: absolute;
  left: 36%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
}

.center-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 17px;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.1;
}

.center-label {
  font-size: 10px;
  color: var(--color-text-muted);
  margin-top: 2px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
</style>
