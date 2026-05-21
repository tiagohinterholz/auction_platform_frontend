import { defineStore } from "pinia";
import { authApi } from "../api/auth.api";
import type { LoginDto } from "../types/login.dto";
import type { RegisterDto } from "../types/register.dto";
import type { AuthResponseDto } from "../types/auth-response.dto";

interface AuthState {
  accessToken: string | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => {
    const rawToken = localStorage.getItem("access_token");

    return {
      accessToken: rawToken && rawToken !== "null" ? rawToken : null,
    };
  },

  getters: {
    isAuthenticated: (state) => !!state.accessToken,
  },

  actions: {
    setAuthData(data: AuthResponseDto) {
      this.accessToken = data.access_token;

      localStorage.setItem("access_token", data.access_token);
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
        localStorage.removeItem("access_token");
      }
    },
  },
});
