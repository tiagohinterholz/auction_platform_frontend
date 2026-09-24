import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { setActivePinia, createPinia } from "pinia";
import { api } from "@/api/http";
import { useAuthStore } from "@/modules/auth";
import AuctionDetailView from "./AuctionDetailView.vue";

vi.mock("vue-router", () => ({
  useRoute: () => ({ params: { id: "auction-1" } }),
}));

vi.mock("@/api/http", () => ({
  api: { get: vi.fn(), post: vi.fn(), patch: vi.fn() },
}));

vi.mock("../composables/useAuctionSocket", () => ({
  useAuctionSocket: () => ({ connect: vi.fn(), disconnect: vi.fn(), isConnected: { value: false } }),
}));

function rawAuction(overrides: Record<string, unknown> = {}) {
  return {
    id: "auction-1",
    user_id: "user-1",
    title: "iPhone 15",
    description: "desc",
    status: "active",
    start_price: "100.00",
    minimum_increment: "10.00",
    highest_bid: "150.00",
    images: [],
    ...overrides,
  };
}

function fakeJwt(payload: Record<string, unknown>): string {
  return `header.${btoa(JSON.stringify(payload))}.signature`;
}

async function flushPromises() {
  await new Promise((resolve) => setTimeout(resolve, 0));
}

function mountView() {
  return mount(AuctionDetailView, {
    global: { stubs: { AuctionTimer: true } },
  });
}

describe("AuctionDetailView", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    vi.mocked(api.get).mockImplementation((url: string) => {
      if (url.endsWith("/bids")) return Promise.resolve({ data: [] });
      return Promise.resolve({ data: rawAuction() });
    });
  });

  it("fetches the auction and bids on mount, shows the current highest bid", async () => {
    const wrapper = mountView();
    await flushPromises();

    expect(api.get).toHaveBeenCalledWith("/auctions/auction-1");
    expect(api.get).toHaveBeenCalledWith("/auctions/auction-1/bids");
    expect(wrapper.text()).toContain("150");
  });

  it("shows the minimum suggested bid as highestBid + minimumIncrement", async () => {
    const wrapper = mountView();
    await flushPromises();

    // 150 (highest bid) + 10 (minimum increment) = 160
    expect(wrapper.text()).toContain("160");
  });

  it("does not place a bid when the user is not authenticated", async () => {
    const wrapper = mountView();
    await flushPromises();

    await wrapper.find("form").trigger("submit.prevent");
    await flushPromises();

    expect(api.post).not.toHaveBeenCalled();
    expect(wrapper.text()).toContain("Faça login para dar um lance");
  });

  it("places a bid with the suggested amount when authenticated", async () => {
    const authStore = useAuthStore();
    authStore.setAuthData({
      access_token: fakeJwt({ sub: "user-2" }),
      refresh_token: "r1",
    });
    vi.mocked(api.post).mockResolvedValue({ data: { status: "created" } });

    const wrapper = mountView();
    await flushPromises();

    await wrapper.find("form").trigger("submit.prevent");
    await flushPromises();

    expect(api.post).toHaveBeenCalledWith("/auctions/auction-1/bids", { amount: 160 });
  });

  it("disables the bid button when the auction is not active", async () => {
    vi.mocked(api.get).mockImplementation((url: string) => {
      if (url.endsWith("/bids")) return Promise.resolve({ data: [] });
      return Promise.resolve({ data: rawAuction({ status: "created" }) });
    });
    const authStore = useAuthStore();
    authStore.setAuthData({
      access_token: fakeJwt({ sub: "user-2" }),
      refresh_token: "r1",
    });

    const wrapper = mountView();
    await flushPromises();

    const submitButton = wrapper
      .findAll("button")
      .find((b) => b.text().includes("Dar Lance Agora"));
    expect(submitButton!.attributes("disabled")).toBeDefined();
  });
});
