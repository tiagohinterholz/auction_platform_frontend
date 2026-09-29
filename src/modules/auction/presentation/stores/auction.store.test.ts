import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { AuctionStatus, type Auction } from "@/modules/auction/domain";
import { useAuctionStore } from "./auction.store";

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

describe("useAuctionStore.replaceAuction", () => {
  let store: ReturnType<typeof useAuctionStore>;
  
  beforeEach(() => {
    setActivePinia(createPinia());
    store = useAuctionStore();
  });

  it("replaces the auction in both the public list and my auctions", () => {
    store.auctions = [makeAuction(), makeAuction({ auctionId: "a2" })];
    store.myAuctions = [makeAuction()];

    store.replaceAuction(makeAuction({ status: AuctionStatus.CANCELLED }));

    expect(store.auctions[0]!.status).toBe(AuctionStatus.CANCELLED);
    expect(store.myAuctions[0]!.status).toBe(AuctionStatus.CANCELLED);
    expect(store.auctions[1]!.status).toBe(AuctionStatus.CREATED);
  });

  it("leaves both lists untouched when the auction is not in them", () => {
    store.auctions = [makeAuction()];
    store.myAuctions = [makeAuction()];

    store.replaceAuction(makeAuction({ auctionId: "unknown", status: AuctionStatus.CANCELLED }));

    expect(store.auctions).toEqual([makeAuction()]);
    expect(store.myAuctions).toEqual([makeAuction()]);
  });
});

describe("useAuctionStore live updates", () => {
  let store: ReturnType<typeof useAuctionStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useAuctionStore();
    store.currentAuction = makeAuction({ auctionId: "a1", highestBid: 100 });
  });

  it("applyBidPlaced updates the highest bid of the open auction", () => {
    store.applyBidPlaced("a1", 150);

    expect(store.currentAuction!.highestBid).toBe(150);
  });

  it("applyBidPlaced ignores events from another auction", () => {
    store.applyBidPlaced("other", 150);

    expect(store.currentAuction!.highestBid).toBe(100);
  });

  it("markActive updates to active auction changed", () => {
    store.markActive("a1");

    expect(store.currentAuction?.status).toBe(AuctionStatus.ACTIVE);
  })

  it ("markActive ignores event for other auction", () => {
    store.markActive("b1");

    expect(store.currentAuction?.status).toBe(AuctionStatus.CREATED);
  })

  it("extendEndTime updates new time to auction", () => {
    store.extendEndTime("a1", "2026-06-01T12:00:30Z")

    expect(store.currentAuction?.endTime).toBe("2026-06-01T12:00:30Z");
  })

  it("extendEndTime ignores events from another auction", () => {
    const before = store.currentAuction?.endTime;

    store.extendEndTime("b1", "2026-06-01T12:00:30Z");

    expect(store.currentAuction?.endTime).toBe(before);
  });
});