import type { DashboardConfig } from '@/app/dashboardTypes'
import { markRaw } from 'vue'
import { TrendingUp, Droplets, Flame, BarChart2, Percent, ArrowLeftRight, Gem, Cpu } from '@lucide/vue'
import { equities } from './equities'
import { oil } from './oil'
import { lng } from './lng'
import { indices, rates, fx, commoditiesCrypto } from './overview'

export const equitiesDashboard: DashboardConfig = {
  title: 'Equities',
  icon: markRaw(Cpu),
  instrumentIds: equities.map((i) => i.id),
  chartMode: 'absolute',
  defaultRange: '1M',
}

export const oilDashboard: DashboardConfig = {
  title: 'Oil Markets',
  icon: markRaw(Droplets),
  instrumentIds: oil.map((i) => i.id),
  chartMode: 'absolute',
  defaultRange: '1M',
}

export const lngDashboard: DashboardConfig = {
  title: 'LNG Markets',
  icon: markRaw(Flame),
  instrumentIds: lng.map((i) => i.id),
  chartMode: 'absolute',
  defaultRange: '1M',
}

export const indicesDashboard: DashboardConfig = {
  title: 'Indices',
  icon: markRaw(BarChart2),
  instrumentIds: indices.map((i) => i.id),
  chartMode: 'absolute',
  defaultRange: '1M',
}

export const ratesDashboard: DashboardConfig = {
  title: 'Rates',
  icon: markRaw(Percent),
  instrumentIds: rates.map((i) => i.id),
  chartMode: 'absolute',
  defaultRange: '1M',
}

export const fxDashboard: DashboardConfig = {
  title: 'FX',
  icon: markRaw(ArrowLeftRight),
  instrumentIds: fx.map((i) => i.id),
  chartMode: 'absolute',
  defaultRange: '1M',
}

export const commoditiesDashboard: DashboardConfig = {
  title: 'Commodities & Crypto',
  icon: markRaw(Gem),
  instrumentIds: commoditiesCrypto.map((i) => i.id),
  chartMode: 'absolute',
  defaultRange: '1M',
}

export const overviewDashboard: DashboardConfig = {
  title: 'Markets Overview',
  icon: markRaw(TrendingUp),
  instrumentIds: [...indices, ...rates, ...fx, ...commoditiesCrypto].map((i) => i.id),
  chartMode: 'absolute',
  defaultRange: '1M',
}
