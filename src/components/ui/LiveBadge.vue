<script setup lang="ts">
defineProps<{ connected?: boolean }>()
</script>

<template>
  <div class="live-badge" :class="connected === false ? 'live-badge--offline' : 'live-badge--live'">
    <span class="live-dot" />
    <span class="live-label">{{ connected === false ? 'Offline' : 'Live' }}</span>
  </div>
</template>

<style scoped>
.live-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 8px;
  border-radius: 99px;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.live-badge--live {
  background-color: color-mix(in srgb, var(--color-positive) 12%, transparent);
  color: var(--color-positive);
  border: 1px solid color-mix(in srgb, var(--color-positive) 30%, transparent);
}

.live-badge--offline {
  background-color: color-mix(in srgb, var(--color-text-muted) 12%, transparent);
  color: var(--color-text-muted);
  border: 1px solid color-mix(in srgb, var(--color-text-muted) 30%, transparent);
}

.live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: currentColor;
  flex-shrink: 0;
}

.live-badge--live .live-dot {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
</style>
