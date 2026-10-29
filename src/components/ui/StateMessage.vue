<script setup lang="ts">
defineProps<{
  type: 'empty' | 'error'
  title: string
  description?: string
}>()

defineEmits<{ retry: [] }>()
</script>

<template>
  <div class="state-msg" :class="`state-msg--${type}`">
    <div class="state-msg-icon" aria-hidden="true">
      <span v-if="type === 'empty'">◌</span>
      <span v-else>⚠</span>
    </div>
    <p class="state-msg-title">{{ title }}</p>
    <p v-if="description" class="state-msg-desc">{{ description }}</p>
    <button v-if="type === 'error'" class="state-msg-retry" type="button" @click="$emit('retry')">
      Retry
    </button>
  </div>
</template>

<style scoped>
.state-msg {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 40px 24px;
  text-align: center;
}

.state-msg-icon {
  font-size: 28px;
  line-height: 1;
  color: var(--color-text-muted);
  margin-bottom: 4px;
}

.state-msg--error .state-msg-icon {
  color: var(--color-negative);
}

.state-msg-title {
  margin: 0;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.state-msg-desc {
  margin: 0;
  font-size: 12px;
  color: var(--color-text-muted);
  max-width: 300px;
}

.state-msg-retry {
  margin-top: 8px;
  padding: 6px 16px;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-primary);
  background-color: var(--color-panel-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-control);
  cursor: pointer;
  transition: background-color 0.15s;
}

.state-msg-retry:hover {
  background-color: var(--color-border);
}
</style>
