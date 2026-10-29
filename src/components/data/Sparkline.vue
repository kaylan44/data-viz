<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    values: number[]
    width?: number
    height?: number
  }>(),
  { width: 80, height: 24 },
)

const PAD = 1

const trend = computed(() => {
  if (props.values.length < 2) return 'flat'
  const delta = props.values[props.values.length - 1] - props.values[0]
  if (delta > 0) return 'up'
  if (delta < 0) return 'down'
  return 'flat'
})

const color = computed(() => {
  if (trend.value === 'up') return 'var(--color-positive)'
  if (trend.value === 'down') return 'var(--color-negative)'
  return 'var(--color-text-muted)'
})

const polyline = computed(() => {
  const vals = props.values
  if (vals.length < 2) return ''
  const min = Math.min(...vals)
  const max = Math.max(...vals)
  const range = max - min || 1
  const w = props.width - PAD * 2
  const h = props.height - PAD * 2
  return vals
    .map((v, i) => {
      const x = PAD + (i / (vals.length - 1)) * w
      const y = PAD + h - ((v - min) / range) * h
      return `${x.toFixed(2)},${y.toFixed(2)}`
    })
    .join(' ')
})
</script>

<template>
  <svg
    :width="width"
    :height="height"
    :viewBox="`0 0 ${width} ${height}`"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <polyline
      v-if="polyline"
      :points="polyline"
      fill="none"
      :stroke="color"
      stroke-width="1.5"
      stroke-linejoin="round"
      stroke-linecap="round"
    />
  </svg>
</template>
