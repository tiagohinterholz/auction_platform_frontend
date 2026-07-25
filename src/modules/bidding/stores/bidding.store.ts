import { defineStore } from "pinia";
import { BiddingAPI } from "../api/bidding.api";
import type { Bid } from "../types";

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
      try {
        this.bids = await BiddingAPI.getBidsByAuction(auctionId);
      } catch (err: any) {
        this.error =
          err.response?.data?.message || "Falha ao buscar lances.";
      } finally {
        this.isLoading = false;
      }
    },

    async placeBid(auctionId: string, amount: number): Promise<boolean> {
      this.error = null;
      try {
        await BiddingAPI.placeBid(auctionId, { amount });
        return true;
      } catch (err: any) {
        this.error =
          err.response?.data?.message || "Falha ao registrar lance.";
        return false;
      }
    },

    addLiveBid(bid: Bid) {
      const exists = this.bids.find((b) => b.id === bid.id);
      if (!exists) {
        this.bids.unshift(bid);
      }
    },

    clearBids() {
      this.bids = [];
      this.error = null;
    },
  },
});
