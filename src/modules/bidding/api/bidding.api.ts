import { api } from "@/api/http";
import type { Bid, PlaceBidPayload } from "../types";

/** Mirrors auction.api.ts's mapAuction: backend is snake_case, amount is a
 * Decimal serialized as string. */
export function mapBid(raw: any): Bid {
  return {
    id: raw.id,
    auctionId: raw.auction_id,
    userId: raw.user_id,
    amount: Number(raw.amount),
    createdAt: raw.timestamp,
  };
}

export const BiddingAPI = {
  async getBidsByAuction(auctionId: string): Promise<Bid[]> {
    const response = await api.get<any[]>(`/auctions/${auctionId}/bids`);
    return response.data.map(mapBid);
  },

  async placeBid(auctionId: string, payload: PlaceBidPayload): Promise<void> {
    await api.post(`/auctions/${auctionId}/bids`, { amount: payload.amount });
  },
};
