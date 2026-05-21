import { api } from "../../../api/http";
import { LoginDto } from "../types/login.dto";
import { RegisterDto } from "../types/register.dto";
import {
  AuthResponseDto,
  RefreshResponseDto,
} from "../types/auth-response.dto";

export const authApi = {
  login: async (payload: LoginDto): Promise<AuthResponseDto> => {
    const response = await api.post<AuthResponseDto>("/auth/login", payload);
    return response.data;
  },

  register: async (payload: RegisterDto): Promise<AuthResponseDto> => {
    const response = await api.post<AuthResponseDto>("/auth/register", payload);
    return response.data;
  },
  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },
  refresh: async (): Promise<RefreshResponseDto> => {
    const response = await api.post<RefreshResponseDto>("/auth/refresh");
    return response.data;
  },
};
