<script setup lang="ts" generic="T extends string">
defineProps<{
  options: { value: T; label: string }[]
  modelValue: T
}>()

const emit = defineEmits<{ 'update:modelValue': [value: T] }>()
</script>

<template>
  <div class="seg" role="group">
    <button
      v-for="opt in options"
      :key="opt.value"
      type="button"
      class="seg-item"
      :class="{ 'seg-item--active': modelValue === opt.value }"
      @click="emit('update:modelValue', opt.value)"
    >
      {{ opt.label }}
    </button>
  </div>
</template>

<style scoped>
.seg {
  display: inline-flex;
  background-color: var(--color-canvas);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-control);
  padding: 2px;
  gap: 2px;
}

.seg-item {
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 500;
  color: var(--color-text-secondary);
  background: transparent;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  transition: color 0.1s, background-color 0.1s;
  white-space: nowrap;
  letter-spacing: 0.02em;
}

.seg-item:hover {
  color: var(--color-text-primary);
}

.seg-item--active {
  background-color: var(--color-panel-elevated);
  color: var(--color-text-primary);
}
</style>
