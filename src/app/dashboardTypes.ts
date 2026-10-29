import type { ChartMode, TimeRange } from '@/types'

export interface DashboardGroup {
  id: string
  label: string
  instrumentIds: string[]
}

export interface DashboardConfig {
  title: string
  instrumentIds: string[]
  chartMode: ChartMode
  defaultRange: TimeRange
  groups?: DashboardGroup[]
}
