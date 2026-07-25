import type { AuctionStatus } from './auction-status.enum';

export interface Auction {
  auctionId: string;
  userId: string;
  title: string;
  description: string;
  status: AuctionStatus;
  startingPrice: number;
  highestBid: number;
  minimumIncrement: number;
  startTime?: string;
  endTime?: string;
  reason?: string;
  images: string[];
}
