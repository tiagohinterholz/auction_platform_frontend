import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { AuctionStatus, type Auction } from "@/modules/auction/domain";
import type { AuctionGateway } from "@/modules/auction/application/ports/auction.gateway";
import { ok, fail } from "@/shared/lib/result";
import { useAuctionStore } from "../stores/auction.store";
import { useCancelAuction } from "./useCancelAuction";

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

describe("useCancelAuction", () => {
  let store: ReturnType<typeof useAuctionStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useAuctionStore();
    store.myAuctions = [makeAuction()];
  });

  it("updates the store and returns true when the cancellation succeeds", async () => {
    const gateway = makeGateway();
    const cancelled = makeAuction({ status: AuctionStatus.CANCELLED });
    vi.mocked(gateway.cancelAuction).mockResolvedValue(ok(cancelled));
    const { execute, isLoading, error } = useCancelAuction(gateway);

    const success = await execute(makeAuction(), "Não vendo mais");

    expect(success).toBe(true);
    expect(store.myAuctions[0]!.status).toBe(AuctionStatus.CANCELLED);
    expect(isLoading.value).toBe(false);
    expect(error.value).toBeNull();
  });

  it("exposes the error and leaves the store untouched when the gateway fails", async () => {
    const gateway = makeGateway();
    vi.mocked(gateway.cancelAuction).mockResolvedValue(
      fail({ kind: "Unexpected", message: "Falha no servidor" }),
    );
    const { execute, isLoading, error } = useCancelAuction(gateway);

    const success = await execute(makeAuction(), "Não vendo mais");

    expect(success).toBe(false);
    expect(error.value).toBe("Falha no servidor");
    expect(store.myAuctions[0]!.status).toBe(AuctionStatus.CREATED);
    expect(isLoading.value).toBe(false);
  });

  it("rejects an empty reason without calling the gateway", async () => {
    const gateway = makeGateway();
    const { execute, error } = useCancelAuction(gateway);

    const success = await execute(makeAuction(), "   ");

    expect(success).toBe(false);
    expect(error.value).not.toBeNull();
    expect(gateway.cancelAuction).not.toHaveBeenCalled();
  });
});
