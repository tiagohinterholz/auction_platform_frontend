import { api } from "@/api/http";
import type { Bid, PlaceBidPayload } from "../types";

export const BiddingAPI = {
  async getBidsByAuction(auctionId: string): Promise<Bid[]> {
    const response = await api.get<Bid[]>(`/auctions/${auctionId}/bids`);
    return response.data;
  },

  async placeBid(auctionId: string, payload: PlaceBidPayload): Promise<void> {
    await api.post(`/auctions/${auctionId}/bids`, { amount: payload.amount });
  },
};
