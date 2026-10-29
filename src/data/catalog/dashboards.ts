import type { DashboardConfig } from '@/app/dashboardTypes'
import { equities } from './equities'
import { oil } from './oil'
import { indices, rates, fx, commoditiesCrypto } from './overview'

export const equitiesDashboard: DashboardConfig = {
  title: 'Equities',
  instrumentIds: equities.map((i) => i.id),
  chartMode: 'normalized100',
  defaultRange: '1M',
}

export const oilDashboard: DashboardConfig = {
  title: 'Oil Markets',
  instrumentIds: oil.map((i) => i.id),
  chartMode: 'absolute',
  defaultRange: '1M',
}

export const overviewDashboard: DashboardConfig = {
  title: 'Markets Overview',
  instrumentIds: [
    ...indices,
    ...rates,
    ...fx,
    ...commoditiesCrypto,
  ].map((i) => i.id),
  chartMode: 'normalized100',
  defaultRange: '1M',
  groups: [
    {
      id: 'indices',
      label: 'Indices',
      instrumentIds: indices.map((i) => i.id),
    },
    {
      id: 'rates',
      label: 'Rates',
      instrumentIds: rates.map((i) => i.id),
    },
    {
      id: 'fx',
      label: 'FX',
      instrumentIds: fx.map((i) => i.id),
    },
    {
      id: 'commodities',
      label: 'Commodities',
      instrumentIds: commoditiesCrypto.map((i) => i.id),
    },
  ],
}
