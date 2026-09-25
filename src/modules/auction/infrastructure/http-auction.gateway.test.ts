import { describe, it, expect, vi, beforeEach } from "vitest";
import { api } from "@/api/http";
import { HttpAuctionGateway, mapAuction } from "./http-auction.gateway";

vi.mock("@/api/http", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
}));

describe("mapAuction", () => {
  it("maps the real backend contract (snake_case, money as Decimal strings)", () => {
    const raw = {
      id: "auction-1",
      user_id: "user-1",
      title: "Leilão de teste",
      description: "desc",
      status: "active",
      start_price: "100.00",
      minimum_increment: "10.00",
      highest_bid: "150.00",
      start_time: "2026-01-01T10:00:00Z",
      end_time: "2026-01-01T12:00:00Z",
      images: ["img.png"],
    };

    const auction = mapAuction(raw);

    expect(auction).toEqual({
      auctionId: "auction-1",
      userId: "user-1",
      title: "Leilão de teste",
      description: "desc",
      status: "active",
      startingPrice: 100,
      minimumIncrement: 10,
      highestBid: 150,
      startTime: "2026-01-01T10:00:00Z",
      endTime: "2026-01-01T12:00:00Z",
      images: ["img.png"],
    });
  });

  it("falls back highestBid to start_price when highest_bid is null (no bids yet)", () => {
    const raw = {
      id: "auction-1",
      user_id: "user-1",
      title: "t",
      description: "d",
      status: "created",
      start_price: "50.00",
      minimum_increment: "5.00",
      highest_bid: null,
      images: [],
    };

    expect(mapAuction(raw).highestBid).toBe(50);
  });
});

describe("HttpAuctionGateway", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  const auctionGateway = new HttpAuctionGateway();

  it("create() sends snake_case field names, not the internal camelCase ones", async () => {
    vi.mocked(api.post).mockResolvedValue({
      data: {
        id: "a1", user_id: "u1", title: "t", description: "d", status: "created",
        start_price: "10.00", minimum_increment: "1.00", highest_bid: null, images: [],
      },
    });

    await auctionGateway.createAuction({
      title: "t",
      description: "d",
      startingPrice: 10,
      minimumIncrement: 1,
      images: [],
    });

    expect(api.post).toHaveBeenCalledWith("/auctions", {
      title: "t",
      description: "d",
      start_price: 10,
      minimum_increment: 1,
      images: [],
    });
  });

  it("schedule() sends start_date/end_date, not start_time/end_time", async () => {
    vi.mocked(api.patch).mockResolvedValue({
      data: {
        id: "a1", user_id: "u1", title: "t", description: "d", status: "scheduled",
        start_price: "10.00", minimum_increment: "1.00", highest_bid: null, images: [],
      },
    });

    const startTime = "2026-06-01T10:00";
    const endTime = "2026-06-01T12:00";
    await auctionGateway.scheduleAuction("a1", { startTime, endTime });

    expect(api.patch).toHaveBeenCalledWith("/auctions/a1/schedule", {
      start_date: new Date(startTime).toISOString(),
      end_date: new Date(endTime).toISOString(),
    });
  });
});
