import { api } from "@/api/http";
import type { UpdateUserPayload, User } from "../types";

// Unlike auction/bidding, UserResponse's fields (id, name, email, role) have
// no multi-word names, so there is nothing for snake_case vs camelCase to
// disagree on -- no mapping function needed here.
export const UserAPI = {
  async getById(id: string): Promise<User> {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  async update(id: string, payload: UpdateUserPayload): Promise<User> {
    const response = await api.patch<User>(`/users/${id}`, payload);
    return response.data;
  },
};
