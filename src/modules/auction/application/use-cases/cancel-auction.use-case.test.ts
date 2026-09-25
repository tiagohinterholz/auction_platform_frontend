import { describe, it, expect, vi } from "vitest";
import { AuctionStatus, type Auction } from "@/modules/auction/domain";
import type { AuctionGateway } from "@/modules/auction/application/ports/auction.gateway";
import { cancelAuctionUseCase } from "./cancel-auction.use-case";
import { ok } from "@/shared/lib/result";

function makeAuction(overrides: Partial<Auction> = {}): Auction {
  return {
    auctionId: "a1",
    userId: "u1",
    title: "Auction 1",
    description: "Description 1",
    status: AuctionStatus.CREATED,
    startingPrice: 100,
    highestBid: 100,
    minimumIncrement: 10,
    images: [],
    ...overrides,
  };
}

function makeGateway(): AuctionGateway {
  return {
    cancelAuction: vi.fn(),
    createAuction: vi.fn(),
    getAuctionById: vi.fn(),
    getAuctions: vi.fn(),
    getMyAuctions: vi.fn(),
    scheduleAuction: vi.fn(),
  };
}

describe("cancelAuctionUseCase", () => {
  it("rejects an empty reason without calling the gateway", async () => {
    const gateway = makeGateway();
    const auction = makeAuction();

    const result = await cancelAuctionUseCase(gateway, auction, " ");

    expect(result).toEqual({
      ok: false,
      error: { kind: "Validation", message: "Informe o motivo do cancelamento" },
    });
    expect(gateway.cancelAuction).not.toHaveBeenCalled();
  });

  it ("rejects a auction with status active without calling the gateway", async () => {
    const gateway = makeGateway();
    const auction = makeAuction({ status: AuctionStatus.ACTIVE });

    const result = await cancelAuctionUseCase(gateway, auction, "Motivo do cancelamento");

    expect(result).toEqual({
      ok: false,
      error: { kind: "Validation", message: "Este leilão não pode ser cancelado" },
    });
    expect(gateway.cancelAuction).not.toHaveBeenCalled();
  });

  it ("rejects a auction with status active without calling the gateway", async () => {
    const gateway = makeGateway();
    const auction = makeAuction({ status: AuctionStatus.SCHEDULED });
    const cancelled = makeAuction({ status: AuctionStatus.CANCELLED, reason: "Motivo do cancelamento" });
    vi.mocked(gateway.cancelAuction).mockResolvedValue(ok(cancelled));

    const result = await cancelAuctionUseCase(gateway, auction, "Motivo do cancelamento");

    expect(gateway.cancelAuction).toHaveBeenCalledWith("a1", { reason: "Motivo do cancelamento" });
    expect(result).toEqual(ok(cancelled));
  });
});