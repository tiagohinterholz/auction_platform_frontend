import type { RouteRecordRaw } from "vue-router";

const userRoutes: RouteRecordRaw[] = [
  {
    path: "/profile",
    name: "UserProfile",
    component: () => import("../views/UserProfileView.vue"),
    meta: {
      title: "Meu Perfil",
      requiresAuth: true,
    },
  },
];

export default userRoutes;
