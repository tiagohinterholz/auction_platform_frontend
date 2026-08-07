import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { setActivePinia, createPinia } from "pinia";
import { api } from "@/api/http";
import AuctionListView from "./AuctionListView.vue";

const push = vi.fn();

vi.mock("vue-router", () => ({
  useRouter: () => ({ push }),
}));

vi.mock("@/api/http", () => ({
  api: { get: vi.fn(), post: vi.fn(), patch: vi.fn() },
}));

const rawAuction = {
  id: "auction-1",
  user_id: "user-1",
  title: "iPhone 15",
  description: "desc",
  status: "active",
  start_price: "100.00",
  minimum_increment: "10.00",
  highest_bid: "150.00",
  images: [],
};

function mountView() {
  return mount(AuctionListView, {
    global: { stubs: { AuctionTimer: true } },
  });
}

async function flushPromises() {
  await new Promise((resolve) => setTimeout(resolve, 0));
}

describe("AuctionListView", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("fetches on mount and renders each auction's title and highest bid", async () => {
    vi.mocked(api.get).mockResolvedValue({ data: [rawAuction] });

    const wrapper = mountView();
    await flushPromises();

    expect(api.get).toHaveBeenCalledWith("/auctions");
    expect(wrapper.text()).toContain("iPhone 15");
    expect(wrapper.text()).toContain("150");
  });

  it("shows the empty state when there are no auctions", async () => {
    vi.mocked(api.get).mockResolvedValue({ data: [] });

    const wrapper = mountView();
    await flushPromises();

    expect(wrapper.text()).toContain("Nenhum leilão ativo");
  });

  it("shows an error state with a retry button that re-fetches", async () => {
    vi.mocked(api.get).mockRejectedValue({
      response: { data: { message: "Falha de rede" } },
    });

    const wrapper = mountView();
    await flushPromises();

    expect(wrapper.text()).toContain("Falha de rede");

    vi.mocked(api.get).mockResolvedValue({ data: [rawAuction] });
    const retryButton = wrapper
      .findAll("button")
      .find((b) => b.text().includes("Tentar Novamente"));
    await retryButton!.trigger("click");
    await flushPromises();

    expect(wrapper.text()).toContain("iPhone 15");
  });

  it("navigates to the detail page when a card is clicked", async () => {
    vi.mocked(api.get).mockResolvedValue({ data: [rawAuction] });
    const wrapper = mountView();
    await flushPromises();

    const card = wrapper
      .findAll(".cursor-pointer")
      .find((el) => el.text().includes("iPhone 15"));
    await card!.trigger("click");

    expect(push).toHaveBeenCalledWith("/auctions/auction-1");
  });
});
