import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { AuctionStatus, type Auction } from "@/modules/auction/domain";
import AuctionStatusPill from "./AuctionStatusPill.vue";
import AuctionTimer from "./AuctionTimer.vue";

function makeAuction(overrides: Partial<Auction> = {}): Auction {
  return {
    auctionId: "a1",
    userId: "u1",
    title: "Lote",
    description: "d",
    status: AuctionStatus.CREATED,
    startingPrice: 100,
    highestBid: 100,
    minimumIncrement: 10,
    images: [],
    ...overrides,
  };
}

function mountPill(auction: Auction) {
  return mount(AuctionStatusPill, { props: { auction } });
}

describe("AuctionStatusPill", () => {
  it("shows the countdown for an active auction", () => {
    const wrapper = mountPill(
      makeAuction({ status: AuctionStatus.ACTIVE, endTime: "2099-01-01T00:00:00Z" }),
    );

    expect(wrapper.findComponent(AuctionTimer).exists()).toBe(true);
  });

  it("shows when a scheduled auction starts", () => {
    const startTime = "2099-01-01T15:30:00Z";
    const expected = new Date(startTime).toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });

    const wrapper = mountPill(makeAuction({ status: AuctionStatus.SCHEDULED, startTime }));

    expect(wrapper.text()).toBe(`Começa ${expected}`);
    expect(wrapper.findComponent(AuctionTimer).exists()).toBe(false);
  });

  it.each([
    [AuctionStatus.CREATED, "Criado"],
    [AuctionStatus.SCHEDULED, "Agendado"],
    [AuctionStatus.FINISHED, "Encerrado"],
    [AuctionStatus.CANCELLED, "Cancelado"],
  ])("shows the Portuguese label for %s without a countdown", (status, label) => {
    const wrapper = mountPill(makeAuction({ status, endTime: "2000-01-01T00:00:00Z" }));

    expect(wrapper.text()).toBe(label);
    expect(wrapper.findComponent(AuctionTimer).exists()).toBe(false);
  });
});
