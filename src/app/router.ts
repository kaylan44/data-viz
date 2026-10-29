import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/equities',
    },
    {
      path: '/equities',
      meta: { title: 'Equities — MarketDeck' },
      component: () => import('@/pages/EquitiesPage.vue'),
    },
    {
      path: '/oil',
      meta: { title: 'Oil Markets — MarketDeck' },
      component: () => import('@/pages/OilPage.vue'),
    },
    {
      path: '/overview',
      meta: { title: 'Markets Overview — MarketDeck' },
      component: () => import('@/pages/OverviewPage.vue'),
    },
    {
      path: '/map',
      meta: { title: 'World Map — MarketDeck' },
      component: () => import('@/pages/MapPage.vue'),
    },
    {
      path: '/styleguide',
      meta: { title: 'Style Guide — MarketDeck' },
      component: () => import('@/pages/StyleguidePage.vue'),
    },
  ],
})

router.afterEach((to) => {
  document.title = (to.meta.title as string | undefined) ?? 'MarketDeck'
})
