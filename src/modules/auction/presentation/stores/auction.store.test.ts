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
