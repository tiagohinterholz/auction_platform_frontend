import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { setActivePinia, createPinia } from "pinia";
import { api } from "@/api/http";
import MyAuctionsView from "./MyAuctionsView.vue";

vi.mock("vue-router", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/api/http", () => ({
  api: { get: vi.fn(), post: vi.fn(), patch: vi.fn() },
}));

const createdAuction = {
  id: "auction-1",
  user_id: "user-1",
  title: "iPhone 15",
  description: "desc",
  status: "created",
  start_price: "100.00",
  minimum_increment: "10.00",
  highest_bid: null,
  images: [],
};

async function flushPromises() {
  await new Promise((resolve) => setTimeout(resolve, 0));
}

function mountView() {
  return mount(MyAuctionsView, { global: { stubs: { Teleport: true } } });
}

describe("MyAuctionsView", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    vi.mocked(api.get).mockResolvedValue({ data: [createdAuction] });
  });

  it("schedule sends start_date/end_date as full ISO strings", async () => {
    vi.mocked(api.patch).mockResolvedValue({
      data: { ...createdAuction, status: "scheduled" },
    });
    const wrapper = mountView();
    await flushPromises();

    const scheduleButton = wrapper
      .findAll("button")
      .find((b) => b.text() === "Agendar");
    await scheduleButton!.trigger("click");

    const inputs = wrapper.findAll("input[type=datetime-local]");
    await inputs[0]!.setValue("2026-06-01T10:00");
    await inputs[1]!.setValue("2026-06-01T12:00");

    const confirmButton = wrapper
      .findAll("button")
      .find((b) => b.text() === "Confirmar");
    await confirmButton!.trigger("click");
    await flushPromises();

    expect(api.patch).toHaveBeenCalledWith("/auctions/auction-1/schedule", {
      start_date: new Date("2026-06-01T10:00").toISOString(),
      end_date: new Date("2026-06-01T12:00").toISOString(),
    });
  });

  it("cancel confirm button is disabled until a reason is typed, and sends it once filled", async () => {
    vi.mocked(api.patch).mockResolvedValue({
      data: { ...createdAuction, status: "cancelled" },
    });
    const wrapper = mountView();
    await flushPromises();

    const cancelOpenButton = wrapper
      .findAll("button")
      .find((b) => b.text() === "Cancelar");
    await cancelOpenButton!.trigger("click");

    const confirmCancelButton = wrapper
      .findAll("button")
      .find((b) => b.text().includes("Confirmar Cancelamento"));
    expect(confirmCancelButton!.attributes("disabled")).toBeDefined();

    await wrapper.find("textarea").setValue("Não vendo mais o item.");
    expect(confirmCancelButton!.attributes("disabled")).toBeUndefined();

    await confirmCancelButton!.trigger("click");
    await flushPromises();

    expect(api.patch).toHaveBeenCalledWith("/auctions/auction-1/cancel", {
      reason: "Não vendo mais o item.",
    });
  });
});
