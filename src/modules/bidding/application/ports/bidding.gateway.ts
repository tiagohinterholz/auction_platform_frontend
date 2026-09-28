import type { Result } from '@/shared/lib/result';
import type { Bid, PlaceBidPayload } from '@/modules/bidding/domain';

export interface BiddingGateway { 
  getBidsByAuction(auctionId: string): Promise<Result<Bid[]>>;
  placeBid(auctionId: string, payload: PlaceBidPayload): Promise<Result<void>>;
}