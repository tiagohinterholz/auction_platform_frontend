import { ref, onUnmounted } from "vue";
import { useAuctionStore } from "@/modules/auction/presentation/stores/auction.store";
import type { AuctionRealtime } from '@/modules/auction/application/ports/auction-realtime';
import { auctionRealtime } from '@/container';
import type { AuctionEvent } from '@/modules/auction/domain';
/**
 * Backend speaks a native WebSocket protocol at /ws/auctions/{auction_id}
 * (see notification_router.py), not socket.io. Connecting already
 * subscribes to that auction's room -- no join message needed. Every
 * broadcast is `{"event": "<name>", "payload": {...snake_case...}}`.
 */

export function useAuctionSocket(
  auctionId: string,
  onBidPlaced: () => void,
  realtime: AuctionRealtime = auctionRealtime
) {
  const store = useAuctionStore();
  const isConnected = ref(false);
  let unsubscribe: (() => void) | null = null;

  function handle(event: AuctionEvent) {
    switch (event.type) {
      case "BidPlaced":       store.applyBidPlaced(event.auctionId, event.amount); onBidPlaced(); break;
      case "AuctionStarted":  store.markActive(event.auctionId); break;
      case "AuctionExtended": store.extendEndTime(event.auctionId, event.endTime); break;
      case "AuctionChanged":  store.fetchAuctionById(event.auctionId); break;
    }
  }

  function connect()    { unsubscribe = realtime.subscribe(auctionId, handle); isConnected.value = true; }
  function disconnect() { unsubscribe?.(); unsubscribe = null; isConnected.value = false; }

  onUnmounted(disconnect);
  return { connect, disconnect, isConnected };
}
