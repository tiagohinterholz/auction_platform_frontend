import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { UserAPI } from "../api/user.api";
import { useUserStore } from "./user.store";

vi.mock("../api/user.api", () => ({
  UserAPI: {
    getById: vi.fn(),
    update: vi.fn(),
  },
}));

const user = { id: "u1", name: "Ana", email: "ana@test.com", role: "user" };

describe("useUserStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("fetchProfile populates profile on success", async () => {
    vi.mocked(UserAPI.getById).mockResolvedValue(user);
    const store = useUserStore();

    await store.fetchProfile("u1");

    expect(store.profile).toEqual(user);
    expect(store.error).toBeNull();
    expect(store.isLoading).toBe(false);
  });

  it("fetchProfile sets error and leaves profile null on failure", async () => {
    vi.mocked(UserAPI.getById).mockRejectedValue({
      response: { data: { message: "not found" } },
    });
    const store = useUserStore();

    await store.fetchProfile("u1");

    expect(store.profile).toBeNull();
    expect(store.error).toBe("not found");
  });

  it("updateProfile updates profile and returns true on success", async () => {
    const updated = { ...user, name: "Ana Maria" };
    vi.mocked(UserAPI.update).mockResolvedValue(updated);
    const store = useUserStore();

    const result = await store.updateProfile("u1", { name: "Ana Maria" });

    expect(result).toBe(true);
    expect(store.profile).toEqual(updated);
    expect(UserAPI.update).toHaveBeenCalledWith("u1", { name: "Ana Maria" });
  });

  it("updateProfile sets error and returns false on failure, without touching profile", async () => {
    vi.mocked(UserAPI.getById).mockResolvedValue(user);
    const store = useUserStore();
    await store.fetchProfile("u1");

    vi.mocked(UserAPI.update).mockRejectedValue({
      response: { data: { message: "email already registered" } },
    });
    const result = await store.updateProfile("u1", { email: "taken@test.com" });

    expect(result).toBe(false);
    expect(store.error).toBe("email already registered");
    expect(store.profile).toEqual(user);
  });
});
