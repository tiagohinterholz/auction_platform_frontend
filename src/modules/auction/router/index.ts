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
];

export default auctionRoutes;
