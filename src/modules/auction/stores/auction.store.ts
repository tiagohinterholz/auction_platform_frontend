import { defineStore } from "pinia";
import { AuctionAPI } from "../api/auction.api";
import {
  AuctionStatus,
  type Auction,
  type CancelAuctionPayload,
  type CreateAuctionPayload,
  type ScheduleAuctionPayload,
} from "../types";

export const useAuctionStore = defineStore("auctions", {
  state: () => ({
    auctions: [] as Auction[],
    myAuctions: [] as Auction[],
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
      } catch (err: any) {
        this.error = err.response?.data?.detail || err.response?.data?.message || 'Falha ao buscar leilões.';
      } finally {
        this.isLoading = false;
      }
    },

    async fetchMyAuctions() {
      this.isLoading = true;
      this.error = null;
      try {
        const data = await AuctionAPI.getMyAuctions();
        this.myAuctions = data;
      } catch (err: any) {
        this.error = err.response?.data?.detail || err.response?.data?.message || 'Falha ao buscar seus leilões.';
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
        this.error = err.response?.data?.detail || err.response?.data?.message || 'Falha ao criar leilão.';
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
      } catch (err: any) {
        this.error = err.response?.data?.detail || err.response?.data?.message || 'Falha ao buscar detalhes do leilão.';
      } finally {
        this.isLoading = false;
      }
    },
    
    async cancelAuction(id: string, payload: CancelAuctionPayload) {
      this.isLoading = true;
      this.error = null;
      try {
        const canceled = await AuctionAPI.cancel(id, payload)
        const indexPublic = this.auctions.findIndex(a => a.auctionId === id)
        if (indexPublic !== -1) this.auctions.splice(indexPublic, 1, canceled)
        const indexMy = this.myAuctions.findIndex(a => a.auctionId === id)
        if (indexMy !== -1) this.myAuctions.splice(indexMy, 1, canceled)


      } catch (err: any) {
        this.error = err.response?.data?.detail || err.response?.data?.message || 'Falha ao cancelar leilão.';
      } finally {
        this.isLoading = false;
      }
    },

    async scheduleAuction(id: string, data: ScheduleAuctionPayload) {
      this.isLoading = true;
      this.error = null;
      try {
        const scheduled = await AuctionAPI.schedule(id, data);
        const indexPublic = this.auctions.findIndex(a => a.auctionId === id)
        if (indexPublic !== -1) this.auctions.splice(indexPublic, 1, scheduled)
        const indexMy = this.myAuctions.findIndex(a => a.auctionId === id)
        if (indexMy !== -1) this.myAuctions.splice(indexMy, 1, scheduled)

      } catch (err: any) {
        this.error = err.response?.data?.detail || err.response?.data?.message || 'Falha ao agendar leilão.';
      } finally {
        this.isLoading = false;
      }
    },
  },
});
