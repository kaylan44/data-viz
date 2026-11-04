<script setup lang="ts">
import AppShell from '@/app/AppShell.vue'
import MarketDashboard from '@/app/MarketDashboard.vue'
import { indicesDashboard, ratesDashboard, fxDashboard, commoditiesDashboard } from '@/data/catalog/dashboards'
</script>

<template>
  <AppShell>
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
  gap: 16px;
}
</style>
