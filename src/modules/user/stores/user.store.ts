import { defineStore } from "pinia";
import { UserAPI } from "../api/user.api";
import type { UpdateUserPayload, User } from "../types";

export const useUserStore = defineStore("user", {
  state: () => ({
    profile: null as User | null,
    isLoading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchProfile(id: string) {
      this.isLoading = true;
      this.error = null;
      try {
        this.profile = await UserAPI.getById(id);
      } catch (err: any) {
        this.error = err.response?.data?.message || "Falha ao buscar perfil.";
      } finally {
        this.isLoading = false;
      }
    },

    async updateProfile(id: string, payload: UpdateUserPayload): Promise<boolean> {
      this.isLoading = true;
      this.error = null;
      try {
        this.profile = await UserAPI.update(id, payload);
        return true;
      } catch (err: any) {
        this.error = err.response?.data?.message || "Falha ao atualizar perfil.";
        return false;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
