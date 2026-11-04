<script setup lang="ts">
import AppShell from '@/app/AppShell.vue'
import MarketDashboard from '@/app/MarketDashboard.vue'
import { indicesDashboard, ratesDashboard, fxDashboard, commoditiesDashboard } from '@/data/catalog/dashboards'
</script>

<template>
  <AppShell no-pad>
    <div class="overview-layout">
      <MarketDashboard :config="indicesDashboard" compact />
      <MarketDashboard :config="ratesDashboard" compact />
      <MarketDashboard :config="fxDashboard" compact />
      <MarketDashboard :config="commoditiesDashboard" compact />
    </div>
  </AppShell>
</template>

<style scoped>
.overview-layout {
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: calc(100vh - 52px - 40px);
  padding: 12px 24px;
  box-sizing: border-box;
  overflow-y: auto;
}
</style>
