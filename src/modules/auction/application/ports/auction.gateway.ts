import type { 
  Auction, 
  CancelAuctionPayload, 
  CreateAuctionPayload, 
  ScheduleAuctionPayload 
} from '@/modules/auction/domain';

export interface AuctionGateway {
  createAuction(payload: CreateAuctionPayload): Promise<Auction>;
  getAuctions(): Promise<Auction[]>;
  getMyAuctions(): Promise<Auction[]>;
  getAuctionById(id: string): Promise<Auction>;
  scheduleAuction(id: string, payload: ScheduleAuctionPayload): Promise<Auction>;
  cancelAuction(id: string, payload: CancelAuctionPayload): Promise<Auction>;
}