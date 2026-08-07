import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { setActivePinia, createPinia } from "pinia";
import { authApi } from "../api/auth.api";
import RegisterView from "./RegisterView.vue";

const push = vi.fn();

vi.mock("vue-router", () => ({
  useRouter: () => ({ push }),
  useRoute: () => ({ query: {} }),
}));

vi.mock("../api/auth.api", () => ({
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

async function flushPromises() {
  await new Promise((resolve) => setTimeout(resolve, 0));
}

async function fillAndSubmit(wrapper: ReturnType<typeof mount>) {
  await wrapper.find("#name").setValue("Ana Silva");
  await wrapper.find("#email").setValue("ana@test.com");
  await wrapper.find("#cpf").setValue("12345678901");
  await wrapper.find("#password").setValue("Pass@123");
  await wrapper.find("form").trigger("submit.prevent");
  await flushPromises();
}

describe("RegisterView", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("registers and redirects home", async () => {
    vi.mocked(authApi.register).mockResolvedValue({
      access_token: fakeJwt({ sub: "u1" }),
      refresh_token: "r1",
    });
    const wrapper = mount(RegisterView, {
      global: { stubs: { RouterLink: true } },
    });

    await fillAndSubmit(wrapper);

    expect(authApi.register).toHaveBeenCalledWith({
      name: "Ana Silva",
      email: "ana@test.com",
      cpf: "12345678901",
      password: "Pass@123",
    });
    expect(push).toHaveBeenCalledWith("/");
  });

  it("shows the backend conflict message (e.g. duplicate cpf) and does not redirect", async () => {
    vi.mocked(authApi.register).mockRejectedValue({
      response: { data: { message: "CPF já cadastrado." } },
    });
    const wrapper = mount(RegisterView, {
      global: { stubs: { RouterLink: true } },
    });

    await fillAndSubmit(wrapper);

    expect(wrapper.text()).toContain("CPF já cadastrado.");
    expect(push).not.toHaveBeenCalled();
  });
});
