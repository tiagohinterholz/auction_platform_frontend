import { defineStore } from "pinia";
import { AuctionAPI } from "../api/auction.api";
import {
  AuctionStatus,
  type Auction,
  type CreateAuctionPayload,
} from "../types";

export const useAuctionStore = defineStore("auctions", {
  state: () => ({
    auctions: [] as Auction[],
    currentAuction: null as Auction | null,
    isLoading: false,
    error: null as string | null,
  }),

  getters: {
    totalAuctions: (state): number => state.auctions.length,
    activeAuctions: (state): Auction[] => {
      return state.auctions.filter(
        (auction) => auction.status === AuctionStatus.ACTIVE,
      );
    },
  },

  actions: {
    async fetchAuctions() {
      this.isLoading = true;
      this.error = null;
      try {
        const data = await AuctionAPI.getAuctions();
        this.auctions = data;
      } catch (err) {
        this.error = "Falha ao buscar leilões.";
      } finally {
        this.isLoading = false;
      }
    },

    async createAuction(
      payload: CreateAuctionPayload,
    ): Promise<Auction | null> {
      this.isLoading = true;
      this.error = null;
      try {
        const newAuction = await AuctionAPI.create(payload);
        return newAuction;
      } catch (err: any) {
        this.error = err.response?.data?.message || "Falha ao criar leilão.";
        return null;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchAuctionById(id: string) {
      this.isLoading = true;
      this.error = null;
      try {
        const data = await AuctionAPI.getById(id);
        this.currentAuction = data;
      } catch (err) {
        this.error = "Falha ao buscar detalhes do leilão.";
      } finally {
        this.isLoading = false;
      }
    },
  },
});
