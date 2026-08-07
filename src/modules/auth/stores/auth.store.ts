import { defineStore } from "pinia";
import { authApi } from "../api/auth.api";
import type { LoginDto } from "../types/login.dto";
import type { RegisterDto } from "../types/register.dto";
import type { AuthResponseDto } from "../types/auth-response.dto";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  name?: string | null;
  email?: string | null;
  role?: string | null;
  userId?: string | null;
}

function decodeJwt(token: string): any {
  try {
    return JSON.parse(atob(token.split(".")[1] ?? ""));
  } catch {
    return null;
  }
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => {
    const rawToken = localStorage.getItem("access_token");
    const rawRefreshToken = localStorage.getItem("refresh_token");
    const payload = rawToken ? decodeJwt(rawToken) : null;

    return {
      accessToken: rawToken && rawToken !== "null" ? rawToken : null,
      refreshToken: rawRefreshToken && rawRefreshToken !== "null" ? rawRefreshToken : null,
      name: payload?.name,
      email: payload?.email,
      role: payload?.role,
      // JWT's standard claim is "sub", not "subject" -- this was always null before.
      userId: payload?.sub || null,
    };
  },

  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    isAdmin: (state) => state.role === "admin",
  },

  actions: {
    setAuthData(data: AuthResponseDto) {
      this.accessToken = data.access_token;
      this.refreshToken = data.refresh_token;

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);

      const payload = decodeJwt(data.access_token);
      this.name = payload?.name || null;
      this.email = payload?.email || null;
      this.role = payload?.role || null;
      this.userId = payload?.sub || null;
    },

    async login(payload: LoginDto) {
      const data = await authApi.login(payload);
      this.setAuthData(data);
    },

    async register(payload: RegisterDto) {
      const data = await authApi.register(payload);
      this.setAuthData(data);
    },

    /** Silently exchanges the refresh token for a new pair. Returns whether
     * it succeeded -- callers (the axios interceptor) decide what to do on
     * failure, this never forces a logout by itself. */
    async refreshSession(): Promise<boolean> {
      if (!this.refreshToken) return false;
      try {
        const data = await authApi.refresh(this.refreshToken);
        this.setAuthData(data);
        return true;
      } catch {
        return false;
      }
    },

    async logout() {
      try {
        if (this.refreshToken) {
          await authApi.logout(this.refreshToken);
        }
      } catch (error) {
        console.error("Logout API failed, forcing local logout", error);
      } finally {
        this.accessToken = null;
        this.refreshToken = null;
        this.name = null;
        this.email = null;
        this.role = null;
        this.userId = null;
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      }
    },
  },
});
