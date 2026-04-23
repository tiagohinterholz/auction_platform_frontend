import { createRouter, createWebHistory } from 'vue-router'
import auctionRoutes from '../modules/auction/router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/HomeView.vue'),
    },
    ...auctionRoutes,
    // As rotas dos outros módulos serão adicionadas aqui
  ]
})

export default router
