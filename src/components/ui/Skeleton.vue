<script setup lang="ts">
defineProps<{
  width?: string
  height?: string
  rounded?: boolean
}>()
</script>

<template>
  <span
    class="skeleton"
    :class="{ 'skeleton--rounded': rounded }"
    :style="{ width: width ?? '100%', height: height ?? '14px' }"
    aria-hidden="true"
  />
</template>

<style scoped>
.skeleton {
  display: block;
  background: linear-gradient(
    90deg,
    var(--color-panel-elevated) 25%,
    color-mix(in srgb, var(--color-border) 80%, var(--color-panel-elevated)) 50%,
    var(--color-panel-elevated) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: var(--radius-control);
}

.skeleton--rounded {
  border-radius: 99px;
}

@media (prefers-reduced-motion: reduce) {
  .skeleton {
    animation: none;
    background: var(--color-panel-elevated);
  }
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
