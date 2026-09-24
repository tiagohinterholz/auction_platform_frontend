import { api } from "@/api/http";
import { LoginDto } from "../domain/login.dto";
import { RegisterDto } from "../domain/register.dto";
import {
  AuthResponseDto,
  RefreshResponseDto,
} from "./auth-response.dto";

export const authApi = {
  login: async (payload: LoginDto): Promise<AuthResponseDto> => {
    const response = await api.post<AuthResponseDto>("/auth/login", payload);
    return response.data;
  },

  register: async (payload: RegisterDto): Promise<AuthResponseDto> => {
    const response = await api.post<AuthResponseDto>("/auth/register", payload);
    return response.data;
  },
  logout: async (refreshToken: string): Promise<void> => {
    await api.post("/auth/logout", { refresh_token: refreshToken });
  },
  refresh: async (refreshToken: string): Promise<RefreshResponseDto> => {
    const response = await api.post<RefreshResponseDto>("/auth/refresh", {
      refresh_token: refreshToken,
    });
    return response.data;
  },
};
