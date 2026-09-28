import { describe, it, expect, vi, beforeEach } from "vitest";
import { defineComponent } from "vue";
import { mount } from "@vue/test-utils";
import { setActivePinia, createPinia } from "pinia";
import { AuctionStatus, type Auction, type AuctionEvent } from "@/modules/auction/domain";
import type { AuctionRealtime } from "@/modules/auction/application/ports/auction-realtime";
import { ok } from "@/shared/lib/result";
import { useAuctionStore } from "../stores/auction.store";
import { useAuctionSocket } from "./useAuctionSocket";

// AuctionChanged makes the store refetch through the container's gateway.
const auctionGateway = vi.hoisted(() => ({ getAuctionById: vi.fn() }));
vi.mock("@/container", () => ({ auctionGateway, auctionRealtime: {} }));

function makeAuction(overrides: Partial<Auction> = {}): Auction {
  return {
    auctionId: "a1",
    userId: "u1",
    title: "Lote",
    description: "d",
    status: AuctionStatus.SCHEDULED,
    startingPrice: 100,
    highestBid: 100,
    minimumIncrement: 10,
    endTime: "2026-06-01T12:00:00Z",
    images: [],
    ...overrides,
  };
}

// Fake realtime: keeps the handler so the test can push events by hand.
function makeRealtime() {
  let handler: ((event: AuctionEvent) => void) | null = null;
  const unsubscribe = vi.fn();
  const realtime: AuctionRealtime = {
    subscribe: vi.fn((_auctionId, onEvent) => {
      handler = onEvent;
      return unsubscribe;
    }),
  };
  return { realtime, unsubscribe, emit: (event: AuctionEvent) => handler!(event) };
}

// onUnmounted needs a component instance, so the composable runs inside one.
function mountSocket(onBidPlaced: () => void, realtime: AuctionRealtime) {
  let socket!: ReturnType<typeof useAuctionSocket>;
  const wrapper = mount(
    defineComponent({
      setup() {
        socket = useAuctionSocket("a1", onBidPlaced, realtime);
        return () => null;
      },
    }),
  );
  return { socket, wrapper };
}

describe("useAuctionSocket", () => {
  let store: ReturnType<typeof useAuctionStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    store = useAuctionStore();
    store.currentAuction = makeAuction();
  });

  it("subscribes to the auction on connect and reports it as connected", () => {
    const { realtime } = makeRealtime();
    const { socket } = mountSocket(vi.fn(), realtime);

    socket.connect();

    expect(realtime.subscribe).toHaveBeenCalledWith("a1", expect.any(Function));
    expect(socket.isConnected.value).toBe(true);
  });

  it("applies a placed bid to the open auction and notifies the page", () => {
    const { realtime, emit } = makeRealtime();
    const onBidPlaced = vi.fn();
    const { socket } = mountSocket(onBidPlaced, realtime);
    socket.connect();

    emit({ type: "BidPlaced", auctionId: "a1", amount: 150 });

    expect(store.currentAuction!.highestBid).toBe(150);
    expect(onBidPlaced).toHaveBeenCalledOnce();
  });

  it("marks the open auction as active when it starts", () => {
    const { realtime, emit } = makeRealtime();
    const { socket } = mountSocket(vi.fn(), realtime);
    socket.connect();

    emit({ type: "AuctionStarted", auctionId: "a1" });

    expect(store.currentAuction!.status).toBe(AuctionStatus.ACTIVE);
  });

  it("moves the end time forward when the auction is extended", () => {
    const { realtime, emit } = makeRealtime();
    const { socket } = mountSocket(vi.fn(), realtime);
    socket.connect();

    emit({ type: "AuctionExtended", auctionId: "a1", endTime: "2026-06-01T12:00:30Z" });

    expect(store.currentAuction!.endTime).toBe("2026-06-01T12:00:30Z");
  });

  it("refetches the auction when it changes on the server", async () => {
    const finished = makeAuction({ status: AuctionStatus.FINISHED });
    auctionGateway.getAuctionById.mockResolvedValue(ok(finished));
    const { realtime, emit } = makeRealtime();
    const { socket } = mountSocket(vi.fn(), realtime);
    socket.connect();

    emit({ type: "AuctionChanged", auctionId: "a1" });
    await vi.waitFor(() => expect(store.currentAuction!.status).toBe(AuctionStatus.FINISHED));

    expect(auctionGateway.getAuctionById).toHaveBeenCalledWith("a1");
  });

  it("unsubscribes when the page unmounts", () => {
    const { realtime, unsubscribe } = makeRealtime();
    const { socket, wrapper } = mountSocket(vi.fn(), realtime);
    socket.connect();

    wrapper.unmount();

    expect(unsubscribe).toHaveBeenCalledOnce();
    expect(socket.isConnected.value).toBe(false);
  });
});
