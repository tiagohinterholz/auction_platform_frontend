import type { AxiosInstance } from "axios";
import axios from "axios";
import router from "../router";
import { useAuthStore } from "../modules/auth/stores/auth.store";

export const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const authStore = useAuthStore();

  if (authStore.accessToken) {
    config.headers.Authorization = `Bearer ${authStore.accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore();
      authStore.logout();

      if (router.currentRoute.value.path !== "/login") {
        router.push({
          path: "/login",
          query: { redirect: router.currentRoute.value.fullPath },
        });
      }
    }
    return Promise.reject(error);
  },
);
