<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  change: number
  changePct: number
  decimals?: number
  showAbsolute?: boolean
}>()

const sign = computed(() => (props.change >= 0 ? '+' : ''))
const pct = computed(() => `${sign.value}${(props.changePct * 100).toFixed(2)}%`)
const abs = computed(() =>
  `${sign.value}${props.change.toFixed(props.decimals ?? 2)}`,
)
const cls = computed(() =>
  props.change > 0 ? 'pos' : props.change < 0 ? 'neg' : 'flat',
)
</script>

<template>
  <span class="price-change" :class="cls">
    <span v-if="showAbsolute" class="abs">{{ abs }}</span>
    <span class="pct">{{ pct }}</span>
  </span>
</template>

<style scoped>
.price-change {
  display: inline-flex;
  gap: 6px;
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  font-size: inherit;
}

.pos { color: var(--color-positive); }
.neg { color: var(--color-negative); }
.flat { color: var(--color-text-muted); }
</style>
