<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import LiveBadge from '@/components/ui/LiveBadge.vue'

defineProps<{ title: string }>()

const utcTime = ref('')

function updateClock() {
  const now = new Date()
  utcTime.value = now.toISOString().slice(11, 19) + ' UTC'
}

let timer: ReturnType<typeof setInterval>

onMounted(() => {
  updateClock()
  timer = setInterval(updateClock, 1000)
})

onUnmounted(() => clearInterval(timer))
</script>

<template>
  <header class="topbar">
    <h1 class="topbar-title">{{ title }}</h1>
    <div class="topbar-right">
      <span class="topbar-clock">{{ utcTime }}</span>
      <LiveBadge />
    </div>
  </header>
</template>

<style scoped>
.topbar {
  height: 52px;
  min-height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-panel);
}

.topbar-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  letter-spacing: 0.02em;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.topbar-clock {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-text-muted);
  font-variant-numeric: tabular-nums;
}
</style>
