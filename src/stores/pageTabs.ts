import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface PageTab {
  value: string
  label: string
}

export const usePageTabsStore = defineStore('pageTabs', () => {
  const tabs = ref<PageTab[]>([])
  const active = ref<string>('')

  function setTabs(newTabs: PageTab[], activeValue: string) {
    tabs.value = newTabs
    active.value = activeValue
  }

  function setActive(value: string) {
    active.value = value
  }

  function clearTabs() {
    tabs.value = []
    active.value = ''
  }

  return { tabs, active, setTabs, setActive, clearTabs }
})
