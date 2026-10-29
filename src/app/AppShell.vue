<script setup lang="ts">
import SidebarNav from './SidebarNav.vue'
import TopBar from './TopBar.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const pageTitles: Record<string, string> = {
  '/equities': 'Equities',
  '/oil': 'Oil Markets',
  '/overview': 'Markets Overview',
  '/map': 'World Map',
  '/styleguide': 'Style Guide',
}

const pageTitle = computed(() => pageTitles[route.path] ?? 'MarketDeck')
</script>

<template>
  <div class="shell">
    <SidebarNav />
    <div class="shell-body">
      <TopBar :title="pageTitle" />
      <main class="shell-main">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.shell {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: var(--color-canvas);
}

.shell-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.shell-main {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 20px 24px;
}
</style>
