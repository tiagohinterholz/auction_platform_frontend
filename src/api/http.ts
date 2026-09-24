import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import axios from "axios";
import router from "../router";
import { useAuthStore } from "@/modules/auth";

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

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// /auth/* calls (including refresh/logout themselves) never trigger a
// silent-refresh retry -- otherwise an already-invalid refresh token could
// loop the interceptor back into itself.
export function isAuthEndpoint(url?: string): boolean {
  return !!url && url.startsWith("/auth/");
}

function forceLogoutAndRedirect() {
  const authStore = useAuthStore();
  authStore.logout();

  if (router.currentRoute.value.path !== "/login") {
    router.push({
      path: "/login",
      query: { redirect: router.currentRoute.value.fullPath },
    });
  }
}

// Concurrent 401s while a refresh is already in flight wait for that single
// refresh instead of each firing their own POST /auth/refresh.
let refreshPromise: Promise<boolean> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryableConfig | undefined;
    const authStore = useAuthStore();

    const canRetry =
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthEndpoint(originalRequest.url) &&
      !!authStore.refreshToken;

    if (canRetry) {
      originalRequest._retry = true;

      if (!refreshPromise) {
        refreshPromise = authStore.refreshSession().finally(() => {
          refreshPromise = null;
        });
      }

      const refreshed = await refreshPromise;

      if (refreshed) {
        originalRequest.headers.Authorization = `Bearer ${authStore.accessToken}`;
        return api(originalRequest);
      }
    }

    if (error.response?.status === 401) {
      forceLogoutAndRedirect();
    }

    return Promise.reject(error);
  },
);
