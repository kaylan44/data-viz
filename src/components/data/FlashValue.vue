<script setup lang="ts">
import { computed, toRef } from 'vue'
import { useFlashOnChange } from '@/composables/useFlashOnChange'

const props = defineProps<{ value: number }>()
const valueRef = toRef(props, 'value')
const { direction } = useFlashOnChange(valueRef)
const cls = computed(() => (direction.value ? `flash-${direction.value}` : ''))
</script>

<template>
  <span class="flash-value" :class="cls"><slot /></span>
</template>

<style scoped>
.flash-value {
  display: inline-block;
  border-radius: 2px;
  transition: background-color 0.05s;
}

.flash-up {
  animation: flash-up 0.6s ease-out forwards;
}

.flash-down {
  animation: flash-down 0.6s ease-out forwards;
}

@keyframes flash-up {
  0% { background-color: color-mix(in srgb, var(--color-positive) 28%, transparent); }
  100% { background-color: transparent; }
}

@keyframes flash-down {
  0% { background-color: color-mix(in srgb, var(--color-negative) 28%, transparent); }
  100% { background-color: transparent; }
}

@media (prefers-reduced-motion: reduce) {
  .flash-up,
  .flash-down { animation: none; }
}
</style>
