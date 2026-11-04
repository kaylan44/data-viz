<script setup lang="ts">
defineProps<{ title: string; subtitle?: string }>()
</script>

<template>
  <div class="panel-header">
    <div class="panel-header-left">
      <slot name="icon" />
      <span class="panel-header-title">{{ title }}</span>
      <span v-if="subtitle" class="panel-header-subtitle">{{ subtitle }}</span>
    </div>
    <div v-if="$slots.actions" class="panel-header-actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped>
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border);
  gap: 12px;
}

.panel-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.panel-header-title {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-text-primary);
  white-space: nowrap;
}

.panel-header-subtitle {
  font-size: 11px;
  color: var(--color-text-muted);
  white-space: nowrap;
}

.panel-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
</style>
