<script setup lang="ts">
import AppShell from '@/app/AppShell.vue'
import MarketDashboard from '@/app/MarketDashboard.vue'
import { oilDashboard, lngDashboard } from '@/data/catalog/dashboards'
</script>

<template>
  <AppShell no-scroll>
    <div class="oil-layout">
      <div class="oil-dash-wrap">
        <MarketDashboard :config="oilDashboard" compact fill-height />
      </div>
      <div class="oil-dash-wrap">
        <MarketDashboard :config="lngDashboard" compact fill-height />
      </div>
    </div>
  </AppShell>
</template>

<style scoped>
.oil-layout {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  overflow: hidden;
}

.oil-dash-wrap {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
</style>
