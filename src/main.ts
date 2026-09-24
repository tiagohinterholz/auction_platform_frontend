import "./styles/global.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import { useAuthStore } from '@/modules/auth';
import { configureHttp } from '@/api/http';

const app = createApp(App);

app.use(createPinia());
app.use(router);

const authStore = useAuthStore();

configureHttp({
  getAccessToken: () => authStore.accessToken,
  hasRefreshToken: () => !!authStore.refreshToken,
  refresh: () => authStore.refreshSession(),
  onUnauthorized: () => {
    authStore.logout();
    if (router.currentRoute.value.path !== "/login") {
      router.push({ path: "/login", query: { redirect: router.currentRoute.value.fullPath } });
    }
  },
})

app.mount("#app");
