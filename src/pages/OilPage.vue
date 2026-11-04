<script setup lang="ts">
import AppShell from '@/app/AppShell.vue'
import MarketDashboard from '@/app/MarketDashboard.vue'
import { oilDashboard, lngDashboard } from '@/data/catalog/dashboards'
</script>

<template>
  <AppShell no-pad>
    <div class="oil-layout">
      <MarketDashboard :config="oilDashboard" compact />
      <MarketDashboard :config="lngDashboard" compact />
    </div>
  </AppShell>
</template>

<style scoped>
.oil-layout {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: calc(100vh - 52px - 40px);
  padding: 12px 24px;
  box-sizing: border-box;
}
</style>
