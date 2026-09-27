import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { AuctionStatus, type Auction } from "@/modules/auction/domain";
import type { AuctionGateway } from "@/modules/auction/application/ports/auction.gateway";
import { ok, fail } from "@/shared/lib/result";
import { useAuctionStore } from "../stores/auction.store";
import { useScheduleAuction } from "./useScheduleAuction";

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

const payload = { startTime: "2026-06-01T10:00", endTime: "2026-06-01T12:00" };

describe("useScheduleAuction", () => {
  let store: ReturnType<typeof useAuctionStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useAuctionStore();
    store.myAuctions = [makeAuction()];
  });

  it("sends the payload, updates the store and returns true on success", async () => {
    const gateway = makeGateway();
    const scheduled = makeAuction({ status: AuctionStatus.SCHEDULED });
    vi.mocked(gateway.scheduleAuction).mockResolvedValue(ok(scheduled));
    const { execute, isLoading, error } = useScheduleAuction(gateway);

    const success = await execute(makeAuction(), payload);

    expect(gateway.scheduleAuction).toHaveBeenCalledWith("a1", payload);
    expect(success).toBe(true);
    expect(store.myAuctions[0]!.status).toBe(AuctionStatus.SCHEDULED);
    expect(isLoading.value).toBe(false);
    expect(error.value).toBeNull();
  });

  it("exposes the backend message and leaves the store untouched on failure", async () => {
    const gateway = makeGateway();
    vi.mocked(gateway.scheduleAuction).mockResolvedValue(
      fail({ kind: "Validation", message: "O horário de início deve ser no futuro." }),
    );
    const { execute, isLoading, error } = useScheduleAuction(gateway);

    const success = await execute(makeAuction(), payload);

    expect(success).toBe(false);
    expect(error.value).toBe("O horário de início deve ser no futuro.");
    expect(store.myAuctions[0]!.status).toBe(AuctionStatus.CREATED);
    expect(isLoading.value).toBe(false);
  });
});
