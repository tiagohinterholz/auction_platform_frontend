import { defineStore } from "pinia";
import { biddingGateway } from "@/container";
import type { Bid } from "../../domain";

export const useBiddingStore = defineStore("bidding", {
  state: () => ({
    bids: [] as Bid[],
    isLoading: false,
    error: null as string | null,
  }),

  getters: {
    highestBid: (state): number => {
      if (state.bids.length === 0) return 0;
      return Math.max(...state.bids.map((b) => b.amount));
    },
  },

  actions: {
    async fetchBids(auctionId: string) {
      this.isLoading = true;
      this.error = null;
      const result = await biddingGateway.getBidsByAuction(auctionId);

      if (result.ok) this.bids = result.value;
      else this.error = result.error.message;
      
      this.isLoading = false;
    },

    clearBids() {
      this.bids = [];
      this.error = null;
    },
  },
});
