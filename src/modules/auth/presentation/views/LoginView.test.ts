import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { setActivePinia, createPinia } from "pinia";
import { authApi } from "../../infrastructure/auth.api";
import LoginView from "./LoginView.vue";

const push = vi.fn();

vi.mock("vue-router", () => ({
  useRouter: () => ({ push }),
  useRoute: () => ({ query: {} }),
}));

vi.mock("@/modules/auth/infrastructure/auth.api", () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    refresh: vi.fn(),
  },
}));

function fakeJwt(payload: Record<string, unknown>): string {
  return `header.${btoa(JSON.stringify(payload))}.signature`;
}

async function fillAndSubmit(wrapper: ReturnType<typeof mount>) {
  await wrapper.find("#email").setValue("ana@test.com");
  await wrapper.find("#password").setValue("Pass@123");
  await wrapper.find("form").trigger("submit.prevent");
  await flushPromises();
}

async function flushPromises() {
  await new Promise((resolve) => setTimeout(resolve, 0));
}

describe("LoginView", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("logs in and redirects to /auctions/create by default", async () => {
    vi.mocked(authApi.login).mockResolvedValue({
      access_token: fakeJwt({ sub: "u1" }),
      refresh_token: "r1",
    });
    const wrapper = mount(LoginView, {
      global: { stubs: { RouterLink: true } },
    });

    await fillAndSubmit(wrapper);

    expect(authApi.login).toHaveBeenCalledWith({
      email: "ana@test.com",
      password: "Pass@123",
    });
    expect(push).toHaveBeenCalledWith("/auctions/create");
  });

  it("shows the backend error message and does not redirect on failure", async () => {
    vi.mocked(authApi.login).mockRejectedValue({
      response: { data: { message: "Invalid credentials" } },
    });
    const wrapper = mount(LoginView, {
      global: { stubs: { RouterLink: true } },
    });

    await fillAndSubmit(wrapper);

    expect(wrapper.text()).toContain("Invalid credentials");
    expect(push).not.toHaveBeenCalled();
  });
});
