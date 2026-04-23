import type { RouteRecordRaw } from 'vue-router';

const auctionRoutes: RouteRecordRaw[] = [
  {
    path: '/auctions',
    name: 'AuctionList',
    component: () => import('../views/AuctionListView.vue'),
    meta: {
      title: 'List of Auctions',
    },
  },
  {
    path: '/auctions/create',
    name: 'CreateAuction',
    component: () => import('../views/CreateAuctionView.vue'),
    meta: {
      title: 'Criar Novo Leilão',
    },
  },
  {
    path: '/auctions/:id',
    name: 'AuctionDetail',
    component: () => import('../views/AuctionDetailView.vue'),
    props: true,
    meta: {
      title: 'Detalhes do Leilão',
    },
  },
];

export default auctionRoutes;
