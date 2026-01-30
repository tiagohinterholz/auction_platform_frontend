import { defineStore } from 'pinia';
import { getAuctions, createAuction as createAuctionApi } from '../api/auction.api';
import { AuctionStatus, type Auction, type CreateAuctionPayload } from '../types';

export const useAuctionStore = defineStore('auctions', {
  state: () => ({
    auctions: [] as Auction[],
    isLoading: false,
    error: null as string | null,
  }),

  getters: {
    totalAuctions: (state): number => state.auctions.length,
    activeAuctions: (state): Auction[] => {
      return state.auctions.filter((auction) => auction.status === AuctionStatus.ACTIVE);
    },
  },

  actions: {
    async fetchAuctions() {
      this.isLoading = true;
      this.error = null;
      try {
        console.log('Before API call');
        const data = await getAuctions();
        console.log('API response:', data);
        this.auctions = data;
        console.log('Auctions state updated:', this.auctions);
      } catch (err) {
        console.error('Error fetching auctions:', err);
        this.error = 'Falha ao buscar leilões.';
      } finally {
        this.isLoading = false;
        console.log('fetchAuctions finished');
      }
    },

    async createAuction(payload: CreateAuctionPayload): Promise<Auction | null> {
      this.isLoading = true;
      this.error = null;
      try {
        const newAuction = await createAuctionApi(payload);
        // this.auctions.push(newAuction); // No longer needed
        return newAuction;
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Falha ao criar leilão.';
        return null;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
