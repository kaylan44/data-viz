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
      component: () => import('@/pages/EquitiesPage.vue'),
    },
    {
      path: '/oil',
      component: () => import('@/pages/OilPage.vue'),
    },
    {
      path: '/overview',
      component: () => import('@/pages/OverviewPage.vue'),
    },
    {
      path: '/map',
      component: () => import('@/pages/MapPage.vue'),
    },
    {
      path: '/styleguide',
      component: () => import('@/pages/StyleguidePage.vue'),
    },
  ],
})
