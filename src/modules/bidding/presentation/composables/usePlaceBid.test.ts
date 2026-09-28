import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { ok, fail } from "@/shared/lib/result";
import type { Bid } from "@/modules/bidding/domain";
import { useBiddingStore } from "../stores/bidding.store";
import { usePlaceBid } from "./usePlaceBid";

// The store's fetchBids reads the gateway from the container, so the fake has
// to replace it there -- injecting it only into usePlaceBid would leave the
// refetch hitting the real HTTP gateway.
const gateway = vi.hoisted(() => ({
  getBidsByAuction: vi.fn(),
  placeBid: vi.fn(),
}));

vi.mock("@/container", () => ({
  biddingGateway: gateway,
  auctionGateway: {},
}));

const bid: Bid = {
  id: "b1",
  auctionId: "a1",
  userId: "u1",
  amount: 110,
  createdAt: "2026-01-01T10:00:00Z",
};

describe("usePlaceBid", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("places the bid, refreshes the bid list and returns true", async () => {
    gateway.placeBid.mockResolvedValue(ok(undefined));
    gateway.getBidsByAuction.mockResolvedValue(ok([bid]));
    const { execute, isLoading, error } = usePlaceBid();

    const success = await execute("a1", 110);

    expect(gateway.placeBid).toHaveBeenCalledWith("a1", { amount: 110 });
    expect(success).toBe(true);
    expect(useBiddingStore().bids).toEqual([bid]);
    expect(isLoading.value).toBe(false);
    expect(error.value).toBeNull();
  });

  it("exposes the backend message and skips the refresh when the bid is rejected", async () => {
    gateway.placeBid.mockResolvedValue(
      fail({ kind: "Validation", message: "Lance abaixo do mínimo" }),
    );
    const { execute, isLoading, error } = usePlaceBid();

    const success = await execute("a1", 50);

    expect(success).toBe(false);
    expect(error.value).toBe("Lance abaixo do mínimo");
    expect(gateway.getBidsByAuction).not.toHaveBeenCalled();
    expect(isLoading.value).toBe(false);
  });
});
