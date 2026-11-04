import type { DashboardConfig } from '@/app/dashboardTypes'
import { equities } from './equities'
import { oil } from './oil'
import { lng } from './lng'
import { indices, rates, fx, commoditiesCrypto } from './overview'

export const equitiesDashboard: DashboardConfig = {
  title: 'Equities',
  instrumentIds: equities.map((i) => i.id),
  chartMode: 'absolute',
  defaultRange: '1M',
}

export const oilDashboard: DashboardConfig = {
  title: 'Oil Markets',
  instrumentIds: oil.map((i) => i.id),
  chartMode: 'absolute',
  defaultRange: '1M',
}

export const lngDashboard: DashboardConfig = {
  title: 'LNG Markets',
  instrumentIds: lng.map((i) => i.id),
  chartMode: 'absolute',
  defaultRange: '1M',
}

export const indicesDashboard: DashboardConfig = {
  title: 'Indices',
  instrumentIds: indices.map((i) => i.id),
  chartMode: 'absolute',
  defaultRange: '1M',
}

export const ratesDashboard: DashboardConfig = {
  title: 'Rates',
  instrumentIds: rates.map((i) => i.id),
  chartMode: 'absolute',
  defaultRange: '1M',
}

export const fxDashboard: DashboardConfig = {
  title: 'FX',
  instrumentIds: fx.map((i) => i.id),
  chartMode: 'absolute',
  defaultRange: '1M',
}

export const commoditiesDashboard: DashboardConfig = {
  title: 'Commodities & Crypto',
  instrumentIds: commoditiesCrypto.map((i) => i.id),
  chartMode: 'absolute',
  defaultRange: '1M',
}
