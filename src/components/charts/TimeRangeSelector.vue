<script setup lang="ts">
import type { TimeRange } from '@/types'
import SegmentedControl from '@/components/ui/SegmentedControl.vue'

defineProps<{ modelValue: TimeRange }>()
defineEmits<{ 'update:modelValue': [value: TimeRange] }>()

const options: { value: TimeRange; label: string }[] = [
  { value: '1D', label: '1D' },
  { value: '5D', label: '5D' },
  { value: '1M', label: '1M' },
  { value: '3M', label: '3M' },
  { value: '1Y', label: '1Y' },
]
</script>

<template>
  <SegmentedControl
    :model-value="modelValue"
    :options="options"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>
