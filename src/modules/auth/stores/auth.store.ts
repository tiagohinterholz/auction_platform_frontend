import { defineStore } from "pinia";
import { authApi } from "../api/auth.api";
import type { LoginDto } from "../types/login.dto";
import type { RegisterDto } from "../types/register.dto";
import type { AuthResponseDto } from "../types/auth-response.dto";

interface AuthState {
  accessToken: string | null;
  name?: string | null;
  email?: string | null;
  role?: string | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => {
    const rawToken = localStorage.getItem("access_token");
    const payload = rawToken ? JSON.parse(atob(rawToken.split('.')[1] ?? '')) : null;

    return {
      accessToken: rawToken && rawToken !== "null" ? rawToken : null,
      name: payload?.name,
      email: payload?.email,
      role: payload?.role,  
    };
  },

  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    isAdmin: (state) => state.role === "admin",
  },

  actions: {
    setAuthData(data: AuthResponseDto) {
      this.accessToken = data.access_token;

      localStorage.setItem("access_token", data.access_token);
      const payload = JSON.parse(atob(data.access_token.split('.')[1] ?? ''));
      this.name = payload.name || null;
      this.email = payload.email || null;
      this.role = payload.role || null;
    },

    async login(payload: LoginDto) {
      const data = await authApi.login(payload);
      this.setAuthData(data);
    },

    async register(payload: RegisterDto) {
      const data = await authApi.register(payload);
      this.setAuthData(data);
    },

    async logout() {
      try {
        if (this.accessToken) {
          await authApi.logout();
        }
      } catch (error) {
        console.error("Logout API failed, forcing local logout", error);
      } finally {
        this.accessToken = null;
        this.name = null;
        this.email = null;
        this.role = null;
        localStorage.removeItem("access_token");
      }
    },
  },
});
