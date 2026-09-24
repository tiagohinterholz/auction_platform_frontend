import { describe, it, expect, vi, beforeEach } from "vitest";
import { api } from "@/api/http";
import { BiddingAPI, mapBid } from "./bidding.api";

vi.mock("@/api/http", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe("mapBid", () => {
  it("maps the real backend contract (snake_case, amount as Decimal string, timestamp -> createdAt)", () => {
    const raw = {
      id: "bid-1",
      auction_id: "auction-1",
      user_id: "user-1",
      amount: "150.00",
      timestamp: "2026-01-01T10:00:00Z",
    };

    expect(mapBid(raw)).toEqual({
      id: "bid-1",
      auctionId: "auction-1",
      userId: "user-1",
      amount: 150,
      createdAt: "2026-01-01T10:00:00Z",
    });
  });
});

describe("BiddingAPI.getBidsByAuction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("maps every bid in the response", async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: [
        { id: "b1", auction_id: "a1", user_id: "u1", amount: "10.00", timestamp: "t1" },
        { id: "b2", auction_id: "a1", user_id: "u2", amount: "20.00", timestamp: "t2" },
      ],
    });

    const bids = await BiddingAPI.getBidsByAuction("a1");

    expect(bids).toEqual([
      { id: "b1", auctionId: "a1", userId: "u1", amount: 10, createdAt: "t1" },
      { id: "b2", auctionId: "a1", userId: "u2", amount: 20, createdAt: "t2" },
    ]);
  });
});
