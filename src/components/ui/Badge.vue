<script setup lang="ts">
defineProps<{
  variant?: 'default' | 'positive' | 'negative' | 'accent' | 'muted'
}>()
</script>

<template>
  <span class="badge" :class="`badge--${variant ?? 'default'}`">
    <slot />
  </span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 7px;
  border-radius: 99px;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.badge--default {
  background-color: var(--color-panel-elevated);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
}

.badge--positive {
  background-color: color-mix(in srgb, var(--color-positive) 12%, transparent);
  color: var(--color-positive);
  border: 1px solid color-mix(in srgb, var(--color-positive) 30%, transparent);
}

.badge--negative {
  background-color: color-mix(in srgb, var(--color-negative) 12%, transparent);
  color: var(--color-negative);
  border: 1px solid color-mix(in srgb, var(--color-negative) 30%, transparent);
}

.badge--accent {
  background-color: color-mix(in srgb, var(--color-accent) 12%, transparent);
  color: var(--color-accent);
  border: 1px solid color-mix(in srgb, var(--color-accent) 30%, transparent);
}

.badge--muted {
  background-color: transparent;
  color: var(--color-text-muted);
  border: 1px solid var(--color-border);
}
</style>
