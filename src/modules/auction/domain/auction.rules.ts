import { AuctionStatus } from "./auction-status.enum";
import type { Auction } from "./auction";

export function minNextBid(auction: Auction): number {
  return auction.highestBid + auction.minimumIncrement;
};

export function isAuctionActive(auction: Auction): boolean {
  return auction.status === AuctionStatus.ACTIVE;
};

export function canBeScheduled(auction: Auction): boolean {
  return auction.status === AuctionStatus.CREATED;
}

export function canBeCancelled(auction: Auction): boolean {
  return auction.status === AuctionStatus.CREATED || auction.status === AuctionStatus.SCHEDULED;
}

export function canPlaceBid(auction: Auction, bid: number): boolean {
  return isAuctionActive(auction) && bid >= minNextBid(auction);
}