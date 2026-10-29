<script setup lang="ts">
defineProps<{
  elevated?: boolean
  noPad?: boolean
}>()
</script>

<template>
  <div class="panel" :class="{ 'panel--elevated': elevated, 'panel--no-pad': noPad }">
    <slot />
  </div>
</template>

<style scoped>
.panel {
  background-color: var(--color-panel);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-panel);
  padding: 16px;
}

.panel--elevated {
  background-color: var(--color-panel-elevated);
}

.panel--no-pad {
  padding: 0;
}
</style>
