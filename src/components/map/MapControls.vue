<script setup lang="ts">
defineEmits<{ zoomIn: []; zoomOut: []; reset: [] }>()
</script>

<template>
  <div class="map-controls">
    <button class="ctrl-btn" title="Zoom in" @click="$emit('zoomIn')">+</button>
    <button class="ctrl-btn" title="Zoom out" @click="$emit('zoomOut')">−</button>
    <button class="ctrl-btn reset" title="Reset view" @click="$emit('reset')">⊙</button>
  </div>
</template>

<style scoped>
.map-controls {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ctrl-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-panel-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-control);
  color: var(--color-text-secondary);
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
  user-select: none;
}

.ctrl-btn:hover {
  color: var(--color-text-primary);
  border-color: var(--color-accent);
}

.ctrl-btn.reset { font-size: 13px; }
</style>
