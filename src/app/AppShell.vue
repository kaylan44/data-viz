<script setup lang="ts">
import SidebarNav from './SidebarNav.vue'
import TopBar from './TopBar.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const props = defineProps<{ noPad?: boolean; noScroll?: boolean }>()

const route = useRoute()

const pageTitles: Record<string, string> = {
  '/equities': 'Equities',
  '/oil': 'Oil & LNG Markets',
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
      <main class="shell-main" :class="{ 'shell-main--no-pad': props.noPad, 'shell-main--no-scroll': props.noScroll }">
        <slot />
      </main>
      <footer class="shell-footer">
        Simulated data for demonstration purposes only.
      </footer>
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
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 20px 24px;
  min-height: 0;
}

.shell-main--no-pad {
  padding: 0;
  overflow: hidden;
}

.shell-main--no-scroll {
  overflow: hidden;
}

.shell-footer {
  flex-shrink: 0;
  padding: 6px 24px;
  font-size: 10px;
  color: var(--color-text-muted);
  border-top: 1px solid var(--color-border);
  text-align: center;
  letter-spacing: 0.04em;
}

/* Mobile: stack vertically, sidebar becomes bottom nav */
@media (max-width: 639px) {
  .shell {
    flex-direction: column;
  }

  .shell-body {
    /* reserve space for bottom nav (56px icons + up to ~44px tabs row) */
    padding-bottom: 100px;
  }

  .shell-main {
    padding: 12px 16px;
    /* always allow scroll on mobile */
    overflow-y: auto !important;
    overflow-x: hidden;
  }

  .shell-main--no-pad {
    padding: 0;
  }

  .shell-footer {
    padding: 6px 16px;
  }
}
</style>
