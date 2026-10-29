<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { BarChart2, Droplets, Globe2, Map, Layers } from '@lucide/vue'

const route = useRoute()

const navItems = [
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
      <div class="sidebar-logo" title="MarketDeck">
        <span class="logo-mark">M</span>
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
  padding: 12px 0;
  gap: 0;
  z-index: 10;
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

.sidebar-logo {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background-color: var(--color-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  flex-shrink: 0;
}

.logo-mark {
  font-weight: 700;
  font-size: 16px;
  color: #000;
  line-height: 1;
  font-family: var(--font-mono);
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
