import { createRouter, createWebHistory } from "vue-router";
import { auctionRoutes } from "@/modules/auction";
import authRoutes from "../modules/auth/router";
import userRoutes from "../modules/user/router";
import { useAuthStore } from "../modules/auth/stores/auth.store";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: () => import("../views/HomeView.vue"),
    },
    ...auctionRoutes,
    ...authRoutes,
    ...userRoutes,
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: "Login", query: { redirect: to.fullPath } });
  } else if (
    (to.name === "Login" || to.name === "Register") &&
    isAuthenticated
  ) {
    next({ name: "Home" });
  } else {
    next();
  }
});

export default router;
