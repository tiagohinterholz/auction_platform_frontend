import type { 
  Auction, 
  CancelAuctionPayload, 
  CreateAuctionPayload, 
  ScheduleAuctionPayload 
} from '@/modules/auction/domain';

import { type Result } from '@/shared/lib/result';

export interface AuctionGateway {
  createAuction(payload: CreateAuctionPayload): Promise<Result<Auction>>;
  getAuctions(): Promise<Result<Auction[]>>;
  getMyAuctions(): Promise<Result<Auction[]>>;
  getAuctionById(id: string): Promise<Result<Auction>>;
  scheduleAuction(id: string, payload: ScheduleAuctionPayload): Promise<Result<Auction>>;
  cancelAuction(id: string, payload: CancelAuctionPayload): Promise<Result<Auction>>;
}