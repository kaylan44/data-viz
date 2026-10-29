<script setup lang="ts">
import type { TickEntry } from '@/composables/useTickLog'

defineProps<{ ticks: TickEntry[] }>()

function fmtTime(ts: number): string {
  return new Date(ts).toISOString().slice(11, 19)
}
</script>

<template>
  <div class="tick-log">
    <TransitionGroup name="tick" tag="div" class="tick-list">
      <div v-for="entry in ticks" :key="`${entry.symbol}-${entry.ts}`" class="tick-row">
        <span class="tick-sym">{{ entry.symbol }}</span>
        <span class="tick-price">{{ entry.quote.last.toFixed(2) }}</span>
        <span
          class="tick-chg"
          :class="entry.quote.changePct >= 0 ? 'pos' : 'neg'"
        >
          {{ entry.quote.changePct >= 0 ? '+' : '' }}{{ (entry.quote.changePct * 100).toFixed(2) }}%
        </span>
        <span class="tick-time">{{ fmtTime(entry.ts) }}</span>
      </div>
    </TransitionGroup>
    <div v-if="ticks.length === 0" class="tick-empty">Waiting for ticks…</div>
  </div>
</template>

<style scoped>
.tick-log {
  overflow: hidden;
}

.tick-list {
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: 4px 0;
}

.tick-row {
  display: grid;
  grid-template-columns: 64px 1fr 80px 70px;
  align-items: center;
  padding: 4px 12px;
  font-size: 11px;
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  gap: 8px;
}

.tick-row:hover { background-color: var(--color-panel-elevated); }

.tick-sym {
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 11px;
}

.tick-price { color: var(--color-text-secondary); text-align: right; }
.tick-chg   { text-align: right; }
.tick-time  { color: var(--color-text-muted); text-align: right; }

.pos { color: var(--color-positive); }
.neg { color: var(--color-negative); }

.tick-empty {
  padding: 12px;
  font-size: 11px;
  color: var(--color-text-muted);
  text-align: center;
}

/* Slide-in animation for new ticks */
.tick-enter-active { transition: all 0.25s ease-out; }
.tick-enter-from { opacity: 0; transform: translateY(-8px); }

@media (prefers-reduced-motion: reduce) {
  .tick-enter-active { transition: none; }
  .tick-enter-from { opacity: 1; transform: none; }
}
</style>
