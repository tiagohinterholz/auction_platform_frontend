import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { setActivePinia, createPinia } from "pinia";
import { api } from "@/api/http";
import { useAuthStore } from "@/modules/auth";
import UserProfileView from "./UserProfileView.vue";

vi.mock("@/api/http", () => ({
  api: { get: vi.fn(), post: vi.fn(), patch: vi.fn() },
}));

function fakeJwt(payload: Record<string, unknown>): string {
  return `header.${btoa(JSON.stringify(payload))}.signature`;
}

async function flushPromises() {
  await new Promise((resolve) => setTimeout(resolve, 0));
}

function loginAs(userId: string) {
  const authStore = useAuthStore();
  authStore.setAuthData({
    access_token: fakeJwt({ sub: userId, name: "Ana", email: "ana@test.com" }),
    refresh_token: "r1",
  });
  return authStore;
}

describe("UserProfileView", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("fetches and displays the logged-in user's own profile", async () => {
    loginAs("user-1");
    vi.mocked(api.get).mockResolvedValue({
      data: { id: "user-1", name: "Ana", email: "ana@test.com", role: "user" },
    });

    const wrapper = mount(UserProfileView);
    await flushPromises();

    expect(api.get).toHaveBeenCalledWith("/users/user-1");
    const nameInput = wrapper.find<HTMLInputElement>("#name").element;
    expect(nameInput.value).toBe("Ana");
  });

  it("submits the edited name/email and syncs them into authStore", async () => {
    const authStore = loginAs("user-1");
    vi.mocked(api.get).mockResolvedValue({
      data: { id: "user-1", name: "Ana", email: "ana@test.com", role: "user" },
    });
    vi.mocked(api.patch).mockResolvedValue({
      data: { id: "user-1", name: "Ana Maria", email: "ana.maria@test.com", role: "user" },
    });

    const wrapper = mount(UserProfileView);
    await flushPromises();

    await wrapper.find("#name").setValue("Ana Maria");
    await wrapper.find("#email").setValue("ana.maria@test.com");
    await wrapper.find("form").trigger("submit.prevent");
    await flushPromises();

    expect(api.patch).toHaveBeenCalledWith("/users/user-1", {
      name: "Ana Maria",
      email: "ana.maria@test.com",
    });
    expect(wrapper.text()).toContain("Perfil atualizado com sucesso");
    expect(authStore.name).toBe("Ana Maria");
    expect(authStore.email).toBe("ana.maria@test.com");
  });
});
