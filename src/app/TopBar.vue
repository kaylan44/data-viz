<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import LiveBadge from '@/components/ui/LiveBadge.vue'
import { usePageTabsStore } from '@/stores/pageTabs'

defineProps<{ title: string }>()

const pageTabsStore = usePageTabsStore()

const utcTime = ref('')
const menuOpen = ref(false)

function updateClock() {
  const now = new Date()
  utcTime.value = now.toISOString().slice(11, 19) + ' UTC'
}

let timer: ReturnType<typeof setInterval>

onMounted(() => {
  updateClock()
  timer = setInterval(updateClock, 1000)
})

onUnmounted(() => clearInterval(timer))

function selectTab(value: string) {
  pageTabsStore.setActive(value)
  menuOpen.value = false
}

function onDocClick(e: MouseEvent) {
  const el = document.getElementById('topbar-menu-anchor')
  if (el && !el.contains(e.target as Node)) menuOpen.value = false
}

onMounted(() => document.addEventListener('click', onDocClick))
onUnmounted(() => document.removeEventListener('click', onDocClick))
</script>

<template>
  <header class="topbar">
    <h1 class="topbar-title">
      <span class="topbar-appname">Data-Viz</span>
      <span class="topbar-sep">/</span>
      {{ title }}
    </h1>
    <div class="topbar-right">
      <span class="topbar-clock">{{ utcTime }}</span>
      <LiveBadge />

      <!-- Hamburger: mobile only, shown when page has tabs -->
      <div
        v-if="pageTabsStore.tabs.length > 0"
        id="topbar-menu-anchor"
        class="hamburger-wrap"
      >
        <button
          class="hamburger-btn"
          :class="{ 'hamburger-btn--open': menuOpen }"
          aria-label="Select tab"
          @click.stop="menuOpen = !menuOpen"
        >
          <span class="bar" />
          <span class="bar" />
          <span class="bar" />
        </button>

        <Transition name="dropdown">
          <div v-if="menuOpen" class="dropdown" role="menu">
            <button
              v-for="tab in pageTabsStore.tabs"
              :key="tab.value"
              type="button"
              role="menuitem"
              class="dropdown-item"
              :class="{ 'dropdown-item--active': pageTabsStore.active === tab.value }"
              @click="selectTab(tab.value)"
            >
              {{ tab.label }}
            </button>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  height: 52px;
  min-height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-panel);
}

.topbar-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  letter-spacing: 0.02em;
  display: flex;
  align-items: center;
  gap: 8px;
}

.topbar-appname {
  color: var(--color-text-muted);
  font-weight: 500;
}

.topbar-sep {
  color: var(--color-border);
  font-weight: 400;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.topbar-clock {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-text-muted);
  font-variant-numeric: tabular-nums;
}

/* Hamburger: hidden on desktop */
.hamburger-wrap {
  display: none;
  position: relative;
}

.hamburger-btn {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  width: 36px;
  height: 36px;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-control);
  cursor: pointer;
  padding: 0;
  transition: border-color 0.15s, background-color 0.15s;
}

.hamburger-btn:hover,
.hamburger-btn--open {
  background-color: var(--color-panel-elevated);
  border-color: color-mix(in srgb, var(--color-accent) 40%, var(--color-border));
}

.bar {
  display: block;
  width: 16px;
  height: 1.5px;
  background-color: var(--color-text-secondary);
  border-radius: 1px;
  transition: background-color 0.15s;
}

.hamburger-btn--open .bar {
  background-color: var(--color-accent);
}

/* Dropdown */
.dropdown {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  min-width: 160px;
  background-color: var(--color-panel-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-panel);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  z-index: 200;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
  background: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  transition: color 0.1s, background-color 0.1s;
}

.dropdown-item:hover {
  color: var(--color-text-primary);
  background-color: color-mix(in srgb, var(--color-text-primary) 6%, transparent);
}

.dropdown-item--active {
  color: var(--color-accent);
  background-color: color-mix(in srgb, var(--color-accent) 10%, transparent);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.12s, transform 0.12s;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* Mobile */
@media (max-width: 639px) {
  .topbar {
    padding: 0 16px;
    height: 48px;
    min-height: 48px;
  }

  .topbar-title {
    font-size: 13px;
    gap: 6px;
  }

  .topbar-clock {
    display: none;
  }

  .hamburger-wrap {
    display: block;
  }
}
</style>
