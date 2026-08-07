import { ref, onUnmounted } from "vue";
import { useBiddingStore } from "@/modules/bidding/stores/bidding.store";
import { useAuctionStore } from "@/modules/auction/stores/auction.store";
import { AuctionStatus } from "@/modules/auction/types";

/**
 * Backend speaks a native WebSocket protocol at /ws/auctions/{auction_id}
 * (see notification_router.py), not socket.io. Connecting already
 * subscribes to that auction's room -- no join message needed. Every
 * broadcast is `{"event": "<name>", "payload": {...snake_case...}}`.
 */
export function toWebSocketUrl(auctionId: string): string {
  const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/v1";
  const wsBase = apiUrl.replace(/^http/, "ws");
  return `${wsBase}/ws/auctions/${auctionId}`;
}

interface ServerMessage {
  event: string;
  payload: Record<string, any>;
}

export function useAuctionSocket(auctionId: string) {
  const socket = ref<WebSocket | null>(null);
  const isConnected = ref(false);
  const biddingStore = useBiddingStore();
  const auctionStore = useAuctionStore();

  function isCurrentAuction(id: string): boolean {
    return auctionStore.currentAuction?.auctionId === id;
  }

  function handleMessage(raw: MessageEvent) {
    let message: ServerMessage;
    try {
      message = JSON.parse(raw.data);
    } catch {
      return;
    }

    const { event, payload } = message;

    switch (event) {
      case "bidPlaced":
        if (isCurrentAuction(payload.auction_id) && auctionStore.currentAuction) {
          auctionStore.currentAuction.highestBid = Number(payload.amount);
        }
        biddingStore.fetchBids(auctionId);
        break;

      case "auctionStarted":
        if (isCurrentAuction(payload.id) && auctionStore.currentAuction) {
          auctionStore.currentAuction.status = AuctionStatus.ACTIVE;
        }
        break;

      case "auctionExtended":
        if (isCurrentAuction(payload.id) && auctionStore.currentAuction) {
          auctionStore.currentAuction.endTime = payload.end_time;
        }
        break;

      case "auctionFinished":
      case "auctionCancelled":
      case "auctionScheduled":
        if (isCurrentAuction(payload.id)) {
          auctionStore.fetchAuctionById(payload.id);
        }
        break;
    }
  }

  function connect() {
    socket.value = new WebSocket(toWebSocketUrl(auctionId));

    socket.value.onopen = () => {
      isConnected.value = true;
    };

    socket.value.onclose = () => {
      isConnected.value = false;
    };

    socket.value.onmessage = handleMessage;
  }

  function disconnect() {
    socket.value?.close();
    socket.value = null;
    isConnected.value = false;
  }

  onUnmounted(() => {
    disconnect();
  });

  return { connect, disconnect, isConnected };
}
