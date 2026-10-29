<script setup lang="ts">
defineProps<{
  label: string
  size?: 'sm' | 'md'
  active?: boolean
  disabled?: boolean
}>()

defineEmits<{ click: [] }>()
</script>

<template>
  <button
    type="button"
    class="icon-btn"
    :class="[`icon-btn--${size ?? 'md'}`, { 'icon-btn--active': active }]"
    :disabled="disabled"
    :aria-label="label"
    :title="label"
  >
    <slot />
  </button>
</template>

<style scoped>
.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-control);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: color 0.15s, background-color 0.15s, border-color 0.15s;
}

.icon-btn:hover:not(:disabled) {
  color: var(--color-text-primary);
  background-color: var(--color-panel-elevated);
}

.icon-btn:disabled {
  opacity: 0.4;
  cursor: default;
}

.icon-btn--active {
  color: var(--color-accent);
  border-color: color-mix(in srgb, var(--color-accent) 40%, transparent);
  background-color: color-mix(in srgb, var(--color-accent) 10%, transparent);
}

.icon-btn--sm {
  width: 28px;
  height: 28px;
}

.icon-btn--md {
  width: 32px;
  height: 32px;
}
</style>
