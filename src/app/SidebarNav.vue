<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { BarChart2, Droplets, Globe2, Map, Layers, PieChart } from '@lucide/vue'
import { usePageTabsStore } from '@/stores/pageTabs'

const route = useRoute()
const pageTabsStore = usePageTabsStore()

const navItems = [
  { to: '/portfolio', icon: PieChart, label: 'Portfolio' },
  { to: '/equities', icon: BarChart2, label: 'Equities' },
  { to: '/oil', icon: Droplets, label: 'Oil Markets' },
  { to: '/overview', icon: Globe2, label: 'Markets Overview' },
  { to: '/map', icon: Map, label: 'World Map' },
]

const styleguideItem = { to: '/styleguide', icon: Layers, label: 'Style Guide' }

function isActive(path: string) {
  return route.path === path
}
</script>

<template>
  <nav class="sidebar" aria-label="Main navigation">
    <div class="sidebar-top">
      <!-- Logo mark -->
      <div class="sidebar-logo-slot">
        <div class="sidebar-logo" title="MarketDeck">
          <img src="/navbar-pic.svg" alt="MarketDeck" class="logo-img" />
        </div>
      </div>

      <!-- Main nav -->
      <ul class="nav-list" role="list">
        <li v-for="item in navItems" :key="item.to">
          <RouterLink
            :to="item.to"
            class="nav-item"
            :class="{ 'nav-item--active': isActive(item.to) }"
            :aria-label="item.label"
            :title="item.label"
          >
            <component :is="item.icon" :size="20" :stroke-width="1.5" />
            <span class="nav-tooltip">{{ item.label }}</span>
          </RouterLink>
        </li>
      </ul>
    </div>

    <div class="sidebar-bottom">
      <RouterLink
        :to="styleguideItem.to"
        class="nav-item nav-item--muted"
        :class="{ 'nav-item--active': isActive(styleguideItem.to) }"
        :aria-label="styleguideItem.label"
        :title="styleguideItem.label"
      >
        <component :is="styleguideItem.icon" :size="18" :stroke-width="1.5" />
        <span class="nav-tooltip">{{ styleguideItem.label }}</span>
      </RouterLink>
    </div>

    <!-- Mobile-only: page tabs row (shown above the icon row when tabs exist) -->
    <div v-if="pageTabsStore.tabs.length > 0" class="mobile-tabs" role="group" aria-label="Page tabs">
      <button
        v-for="tab in pageTabsStore.tabs"
        :key="tab.value"
        type="button"
        class="mobile-tab"
        :class="{ 'mobile-tab--active': pageTabsStore.active === tab.value }"
        @click="pageTabsStore.setActive(tab.value)"
      >
        {{ tab.label }}
      </button>
    </div>
  </nav>
</template>

<style scoped>
.sidebar {
  width: 56px;
  min-width: 56px;
  background-color: var(--color-panel);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 0 12px;
  gap: 0;
  z-index: 10;
}

/* Mobile tabs: hidden on desktop */
.mobile-tabs {
  display: none;
}

/* Mobile: fixed bottom navigation bar */
@media (max-width: 639px) {
  .sidebar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    min-width: 0;
    height: auto;
    flex-direction: column-reverse;
    justify-content: flex-end;
    padding: 0;
    border-right: none;
    border-top: 1px solid var(--color-border);
    z-index: 100;
  }

  /* Icon row */
  .sidebar-top {
    flex-direction: row;
    flex: none;
    height: 56px;
    justify-content: space-around;
    gap: 0;
    align-items: center;
    padding: 0 8px;
    border-top: 1px solid var(--color-border);
  }

  .sidebar-logo-slot {
    display: none;
  }

  .nav-list {
    flex-direction: row;
    gap: 0;
    justify-content: space-around;
    width: 100%;
  }

  .sidebar-bottom {
    flex-direction: row;
    padding: 0 8px;
    width: auto;
  }

  .nav-item {
    width: 44px;
    height: 44px;
  }

  .nav-tooltip {
    display: none;
  }

  /* Tabs row: shown above icon row when tabs exist */
  .mobile-tabs {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 6px 12px;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .mobile-tabs::-webkit-scrollbar {
    display: none;
  }

  .mobile-tab {
    flex-shrink: 0;
    padding: 5px 14px;
    font-size: 12px;
    font-weight: 500;
    color: var(--color-text-secondary);
    background: transparent;
    border: 1px solid transparent;
    border-radius: var(--radius-control);
    cursor: pointer;
    transition: color 0.1s, background-color 0.1s, border-color 0.1s;
    white-space: nowrap;
    letter-spacing: 0.02em;
  }

  .mobile-tab:hover {
    color: var(--color-text-primary);
    background-color: var(--color-panel-elevated);
  }

  .mobile-tab--active {
    color: var(--color-accent);
    background-color: color-mix(in srgb, var(--color-accent) 10%, transparent);
    border-color: color-mix(in srgb, var(--color-accent) 30%, transparent);
  }
}

.sidebar-top {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.sidebar-bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding-bottom: 4px;
}

.sidebar-logo-slot {
  width: 100%;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 8px;
}

.sidebar-logo {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background-color: var(--color-panel-elevated);
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.logo-img {
  width: 22px;
  height: 22px;
  object-fit: contain;
}

.nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  align-items: center;
}

.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-control);
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color 0.15s, background-color 0.15s;
}

.nav-item:hover {
  color: var(--color-text-primary);
  background-color: var(--color-panel-elevated);
}

.nav-item--active {
  color: var(--color-accent);
  background-color: color-mix(in srgb, var(--color-accent) 12%, transparent);
}

.nav-item--active:hover {
  color: var(--color-accent);
  background-color: color-mix(in srgb, var(--color-accent) 18%, transparent);
}

.nav-item--muted {
  opacity: 0.5;
}

.nav-item--muted:hover {
  opacity: 1;
}

/* Tooltip */
.nav-tooltip {
  position: absolute;
  left: calc(100% + 12px);
  top: 50%;
  transform: translateY(-50%);
  background-color: var(--color-panel-elevated);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  font-size: 12px;
  white-space: nowrap;
  padding: 5px 10px;
  border-radius: var(--radius-control);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s;
  z-index: 100;
}

.nav-tooltip::before {
  content: '';
  position: absolute;
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  border: 5px solid transparent;
  border-right-color: var(--color-border);
}

.nav-item:hover .nav-tooltip {
  opacity: 1;
}
</style>
