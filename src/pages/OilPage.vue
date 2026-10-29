<script setup lang="ts">
import AppShell from '@/app/AppShell.vue'
import MarketDashboard from '@/app/MarketDashboard.vue'
import { oilDashboard } from '@/data/catalog/dashboards'
</script>

<template>
  <AppShell>
    <MarketDashboard :config="oilDashboard" />
  </AppShell>
</template>
