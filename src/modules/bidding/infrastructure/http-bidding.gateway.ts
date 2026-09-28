import { api } from "@/api/http";
import type { Bid, PlaceBidPayload } from "../domain";
import type { BiddingGateway } from '../application/ports/bidding.gateway';
import { fail, ok, type Result } from '@/shared/lib/result';
import { toAppError } from '@/shared/lib/app-error';

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

export class HttpBiddingGateway implements BiddingGateway {
  async getBidsByAuction(auctionId: string): Promise<Result<Bid[]>> {
    try {
      const response = await api.get<any[]>(`/auctions/${auctionId}/bids`);
      return ok(response.data.map(mapBid));
    } catch (error) {
      return fail(toAppError(error));
    }
  }

  async placeBid(auctionId: string, payload: PlaceBidPayload): Promise<Result<void>> {
    try {
      await api.post(`/auctions/${auctionId}/bids`, { amount: payload.amount });
      return ok(undefined);
    } catch (error) {
      return fail(toAppError(error));
    }
  }
};
