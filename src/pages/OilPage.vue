<script setup lang="ts">
import AppShell from '@/app/AppShell.vue'
import MarketDashboard from '@/app/MarketDashboard.vue'
import { oilDashboard, lngDashboard } from '@/data/catalog/dashboards'
</script>

<template>
  <AppShell>
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
  gap: 16px;
}
</style>
