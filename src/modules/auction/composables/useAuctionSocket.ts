import { ref, onUnmounted } from "vue";
import { io, type Socket } from "socket.io-client";
import { useBiddingStore } from "@/modules/bidding/stores/bidding.store";
import { useAuctionStore } from "@/modules/auction/stores/auction.store";
import type { Bid } from "@/modules/bidding/types";

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace("/api", "") ?? "http://localhost:3000";

export function useAuctionSocket(auctionId: string) {
  const socket = ref<Socket | null>(null);
  const isConnected = ref(false);
  const biddingStore = useBiddingStore();
  const auctionStore = useAuctionStore();

  function connect() {
    socket.value = io(SOCKET_URL, { transports: ["websocket"] });

    socket.value.on("connect", () => {
      isConnected.value = true;
      socket.value!.emit("joinAuction", { auctionId });
    });

    socket.value.on("disconnect", () => {
      isConnected.value = false;
    });

    socket.value.on("bidPlaced", (payload: Bid) => {
      biddingStore.addLiveBid(payload);
      if (auctionStore.currentAuction) {
        auctionStore.currentAuction.highestBid = payload.amount;
      }
    });

    socket.value.on(
      "auctionExtended",
      (payload: { auctionId: string; newEndTime: string }) => {
        if (
          auctionStore.currentAuction?.auctionId === payload.auctionId
        ) {
          auctionStore.currentAuction.endTime = payload.newEndTime;
        }
      },
    );

    socket.value.on(
      "auctionFinished",
      (payload: { auctionId: string }) => {
        if (
          auctionStore.currentAuction?.auctionId === payload.auctionId
        ) {
          auctionStore.fetchAuctionById(payload.auctionId);
        }
      },
    );

    socket.value.on(
      "auctionCancelled",
      (payload: { auctionId: string }) => {
        if (
          auctionStore.currentAuction?.auctionId === payload.auctionId
        ) {
          auctionStore.fetchAuctionById(payload.auctionId);
        }
      },
    );
  }

  function disconnect() {
    socket.value?.disconnect();
    socket.value = null;
    isConnected.value = false;
  }

  onUnmounted(() => {
    disconnect();
  });

  return { connect, disconnect, isConnected };
}
