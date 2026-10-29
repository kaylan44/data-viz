<script setup lang="ts">
import { ref } from 'vue'
import AppShell from '@/app/AppShell.vue'
import Panel from '@/components/ui/Panel.vue'
import PanelHeader from '@/components/ui/PanelHeader.vue'
import SegmentedControl from '@/components/ui/SegmentedControl.vue'
import Badge from '@/components/ui/Badge.vue'
import LiveBadge from '@/components/ui/LiveBadge.vue'
import IconButton from '@/components/ui/IconButton.vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import StateMessage from '@/components/ui/StateMessage.vue'
import { ZoomIn, ZoomOut, RotateCcw, Settings } from '@lucide/vue'

const range = ref<'1D' | '5D' | '1M' | '3M' | '1Y'>('1D')
const rangeOptions = [
  { value: '1D' as const, label: '1D' },
  { value: '5D' as const, label: '5D' },
  { value: '1M' as const, label: '1M' },
  { value: '3M' as const, label: '3M' },
  { value: '1Y' as const, label: '1Y' },
]
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
</style>
