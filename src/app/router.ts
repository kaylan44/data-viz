import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      meta: { title: 'DataViz' },
      component: () => import('@/pages/LandingPage.vue'),
    },
    {
      path: '/equities',
      meta: { title: 'Equities — DataViz' },
      component: () => import('@/pages/EquitiesPage.vue'),
    },
    {
      path: '/oil',
      meta: { title: 'Oil & LNG Markets — DataViz' },
      component: () => import('@/pages/OilPage.vue'),
    },
    {
      path: '/overview',
      meta: { title: 'Markets Overview — DataViz' },
      component: () => import('@/pages/OverviewPage.vue'),
    },
    {
      path: '/map',
      meta: { title: 'World Map — DataViz' },
      component: () => import('@/pages/MapPage.vue'),
    },
    {
      path: '/portfolio',
      meta: { title: 'Portfolio — DataViz' },
      component: () => import('@/pages/PortfolioPage.vue'),
    },
    {
      path: '/styleguide',
      meta: { title: 'Style Guide — DataViz' },
      component: () => import('@/pages/StyleguidePage.vue'),
    },
  ],
})

router.afterEach((to) => {
  document.title = (to.meta.title as string | undefined) ?? 'DataViz'
})
