import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { authApi } from "../../infrastructure/auth.api";
import { useAuthStore } from "./auth.store";

vi.mock("@/modules/auth/infrastructure/auth.api", () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    refresh: vi.fn(),
  },
}));

function fakeJwt(payload: Record<string, unknown>): string {
  const base64 = btoa(JSON.stringify(payload));
  return `header.${base64}.signature`;
}

describe("useAuthStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("setAuthData decodes userId from the JWT's sub claim, not subject", () => {
    const store = useAuthStore();
    const accessToken = fakeJwt({ sub: "user-123", name: "Ana", email: "a@a.com", role: "user" });

    store.setAuthData({ access_token: accessToken, refresh_token: "refresh-abc" });

    expect(store.userId).toBe("user-123");
    expect(store.refreshToken).toBe("refresh-abc");
    expect(localStorage.getItem("refresh_token")).toBe("refresh-abc");
  });

  it("logout sends the stored refresh_token and clears local state either way", async () => {
    const store = useAuthStore();
    store.setAuthData({
      access_token: fakeJwt({ sub: "u1" }),
      refresh_token: "refresh-abc",
    });

    await store.logout();

    expect(authApi.logout).toHaveBeenCalledWith("refresh-abc");
    expect(store.accessToken).toBeNull();
    expect(store.refreshToken).toBeNull();
    expect(localStorage.getItem("access_token")).toBeNull();
    expect(localStorage.getItem("refresh_token")).toBeNull();
  });

  it("logout clears local state even when the API call fails", async () => {
    const store = useAuthStore();
    store.setAuthData({
      access_token: fakeJwt({ sub: "u1" }),
      refresh_token: "refresh-abc",
    });
    vi.mocked(authApi.logout).mockRejectedValue(new Error("network error"));

    await store.logout();

    expect(store.accessToken).toBeNull();
    expect(store.refreshToken).toBeNull();
  });

  it("refreshSession exchanges the refresh token and updates state on success", async () => {
    const store = useAuthStore();
    store.setAuthData({
      access_token: fakeJwt({ sub: "u1" }),
      refresh_token: "old-refresh",
    });
    const newAccessToken = fakeJwt({ sub: "u1", name: "Ana" });
    vi.mocked(authApi.refresh).mockResolvedValue({
      access_token: newAccessToken,
      refresh_token: "new-refresh",
    });

    const result = await store.refreshSession();

    expect(result).toBe(true);
    expect(authApi.refresh).toHaveBeenCalledWith("old-refresh");
    expect(store.accessToken).toBe(newAccessToken);
    expect(store.refreshToken).toBe("new-refresh");
  });

  it("refreshSession returns false without throwing when there is no refresh token", async () => {
    const store = useAuthStore();

    const result = await store.refreshSession();

    expect(result).toBe(false);
    expect(authApi.refresh).not.toHaveBeenCalled();
  });

  it("refreshSession returns false without throwing when the backend rejects the refresh token", async () => {
    const store = useAuthStore();
    store.setAuthData({
      access_token: fakeJwt({ sub: "u1" }),
      refresh_token: "revoked-refresh",
    });
    vi.mocked(authApi.refresh).mockRejectedValue(new Error("401"));

    const result = await store.refreshSession();

    expect(result).toBe(false);
  });
});
