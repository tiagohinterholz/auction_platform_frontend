import { describe, it, expect, vi, beforeEach } from "vitest";
import { api } from "@/api/http";
import { HttpBiddingGateway, mapBid } from "./http-bidding.gateway";
import { ok } from '@/shared/lib/result';

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

describe("HttpBiddingGateway.getBidsByAuction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  const biddingGateway = new HttpBiddingGateway();

  it("maps every bid in the response", async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: [
        { id: "b1", auction_id: "a1", user_id: "u1", amount: "10.00", timestamp: "t1" },
        { id: "b2", auction_id: "a1", user_id: "u2", amount: "20.00", timestamp: "t2" },
      ],
    });

    const result = await biddingGateway.getBidsByAuction("a1");

    expect(result).toEqual(ok([
      { id: "b1", auctionId: "a1", userId: "u1", amount: 10, createdAt: "t1" },
      { id: "b2", auctionId: "a1", userId: "u2", amount: 20, createdAt: "t2" },
    ]));
  });

  it("returns a Validation failure when the backend rejects with 422", async () => {
    vi.mocked(api.get).mockRejectedValue({
      response: { status: 422, data: { detail: "Leilão inválido" } },
    });

    const result = await biddingGateway.getBidsByAuction("a1");

    expect(result).toEqual({
      ok: false,
      error: { kind: "Validation", message: "Leilão inválido" },
    });
  });
});

describe("HttpBiddingGateway.placeBid", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  const biddingGateway = new HttpBiddingGateway();

  it("posts the amount and returns ok", async () => {
    vi.mocked(api.post).mockResolvedValue({ data: {}}
    );

    const result = await biddingGateway.placeBid("a1", { amount: 150 });

    expect(api.post).toHaveBeenCalledWith("/auctions/a1/bids", { amount: 150 });
    expect(result).toEqual(ok(undefined));
  });

  it("returns a Validation failure when the backend rejects with 422", async () => {
    vi.mocked(api.post).mockRejectedValue({
      response: { status: 422, data: { detail: "Lance abaixo do minimo" } },
    });

    const result = await biddingGateway.placeBid("a1", { amount: 150 });

    expect(result).toEqual({
      ok: false,
      error: { kind: "Validation", message: "Lance abaixo do minimo" },
    });
  });
});
