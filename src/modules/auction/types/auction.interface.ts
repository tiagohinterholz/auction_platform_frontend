import type { AuctionStatus } from './auction-status.enum';

export interface Auction {
  auctionId: string;
  title: string;
  status: AuctionStatus;
  startingPrice: number;
  minimumIncrement: number;
  startTime?: string;
  endTime?: string;
  reason?: string;
  images: string[];
}
