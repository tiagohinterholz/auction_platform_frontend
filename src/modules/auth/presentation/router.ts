import type { RouteRecordRaw } from "vue-router";

const authRoutes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "Login",
    component: () => import("./views/LoginView.vue"),
    meta: {
      title: "Login",
    },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("./views/RegisterView.vue"),
    meta: {
      title: "Register",
    },
  },
];

export default authRoutes;
