import type { ChartMode, TimeRange } from '@/types'
import type { Component } from 'vue'

export interface DashboardGroup {
  id: string
  label: string
  instrumentIds: string[]
}

export interface DashboardConfig {
  title: string
  icon?: Component
  instrumentIds: string[]
  chartMode: ChartMode
  defaultRange: TimeRange
  groups?: DashboardGroup[]
}
