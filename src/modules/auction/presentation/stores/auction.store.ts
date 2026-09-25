import { defineStore } from "pinia";
import {
  AuctionStatus,
  type Auction,
  type CancelAuctionPayload,
  type CreateAuctionPayload,
  type ScheduleAuctionPayload,
} from "@/modules/auction/domain";
import { auctionGateway } from "@/container";

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
      
      const result = await auctionGateway.getAuctions();

      if (result.ok) this.auctions = result.value;
      else this.error = result.error.message;

      this.isLoading = false;
    },

    async fetchMyAuctions() {
      this.isLoading = true;
      this.error = null;

      const result = await auctionGateway.getMyAuctions();

      if (result.ok) this.myAuctions = result.value;
      else this.error = result.error.message;
      this.isLoading = false;
    },

    async createAuction(payload: CreateAuctionPayload): Promise<Auction | null> {
      this.isLoading = true;
      this.error = null;

      const result = await auctionGateway.createAuction(payload);
      
      this.isLoading = false;
      
      if (result.ok) return result.value;
      this.error = result.error.message;

      return null;
    },

    async fetchAuctionById(id: string) {
      this.isLoading = true;
      this.error = null;
      const result = await auctionGateway.getAuctionById(id);
      
      if (result.ok) {
        this.currentAuction = result.value;
      } else {
        this.error = result.error.message;
      }

      this.isLoading = false;
    },
    
    async cancelAuction(id: string, payload: CancelAuctionPayload) {
      this.isLoading = true;
      this.error = null;

      const result = await auctionGateway.cancelAuction(id, payload);

      if (result.ok) {
        const canceled = result.value;
        const indexPublic = this.auctions.findIndex(a => a.auctionId === id)
        if (indexPublic !== -1) this.auctions.splice(indexPublic, 1, canceled)
        const indexMy = this.myAuctions.findIndex(a => a.auctionId === id)
        if (indexMy !== -1) this.myAuctions.splice(indexMy, 1, canceled)
      } else {
        this.error = result.error.message;
      }

      this.isLoading = false;
    },

    async scheduleAuction(id: string, payload: ScheduleAuctionPayload) {
      this.isLoading = true;
      this.error = null;

      const result = await auctionGateway.scheduleAuction(id, payload);

      if (result.ok) {
        const scheduled = result.value;
        const indexPublic = this.auctions.findIndex(a => a.auctionId === id)
        if (indexPublic !== -1) this.auctions.splice(indexPublic, 1, scheduled)
        const indexMy = this.myAuctions.findIndex(a => a.auctionId === id)
        if (indexMy !== -1) this.myAuctions.splice(indexMy, 1, scheduled)
      } else {
        this.error = result.error.message;
      }

      this.isLoading = false;
    },
  },
});
