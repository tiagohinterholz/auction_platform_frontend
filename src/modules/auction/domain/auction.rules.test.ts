import { describe, it, expect } from 'vitest';
import { AuctionStatus, type Auction } from './index';
import { minNextBid, isAuctionActive, canBeScheduled, canBeCancelled, canPlaceBid } from './auction.rules';

function makeAuction(overrides: Partial<Auction> = {}): Auction {
  return {
    auctionId: 'a1',
    userId: 'u1',
    title: 'Test Auction',
    description: 'A test auction',
    status: AuctionStatus.CREATED,
    startingPrice: 100,
    highestBid: 100,
    minimumIncrement: 10,
    images: [],
    ...overrides,
  };
}

describe('Auction Rules', () => {
  it('minNextBid returns correct value', () => {
    const auction = makeAuction({ highestBid: 100, minimumIncrement: 10 });
    
    expect(minNextBid(auction)).toBe(110);
  });

  it('isAuctionActive returns true for active auctions', () => {
    const auction = makeAuction({ status: AuctionStatus.ACTIVE });
    
    expect(isAuctionActive(auction)).toBe(true);
  });

  it('isAuctionActive returns false for created auctions', () => {
    const auction = makeAuction({ status: AuctionStatus.CREATED });
    
    expect(isAuctionActive(auction)).toBe(false);
  });

  it('canBeScheduled returns true for created auctions', () => {
    const auction = makeAuction({ status: AuctionStatus.CREATED });
    
    expect(canBeScheduled(auction)).toBe(true);
  });

  it('canBeScheduled returns false for scheduled auctions', () => {
    const auction = makeAuction({ status: AuctionStatus.SCHEDULED });
    
    expect(canBeScheduled(auction)).toBe(false);
  });

  it('canBeCancelled returns true for created and scheduled auctions', () => {
    const createdAuction = makeAuction({ status: AuctionStatus.CREATED });
    const scheduledAuction = makeAuction({ status: AuctionStatus.SCHEDULED });
    
    expect(canBeCancelled(createdAuction)).toBe(true);
    expect(canBeCancelled(scheduledAuction)).toBe(true);
  });

  it('canBeCancelled returns false for active, finished and cancelled auctions', () => {
    const activeAuction = makeAuction({ status: AuctionStatus.ACTIVE });
    const finishedAuction = makeAuction({ status: AuctionStatus.FINISHED });
    const cancelledAuction = makeAuction({ status: AuctionStatus.CANCELLED });
    
    expect(canBeCancelled(activeAuction)).toBe(false);
    expect(canBeCancelled(finishedAuction)).toBe(false);
    expect(canBeCancelled(cancelledAuction)).toBe(false);
  });

  it('canPlaceBid returns true for active auctions with valid bid', () => {
    const auction = makeAuction({ status: AuctionStatus.ACTIVE, highestBid: 100, minimumIncrement: 10 });
    
    expect(canPlaceBid(auction, 110)).toBe(true);
  });
  
  it('canPlaceBid returns false for active auctions with invalid bid', () => {
    const auction = makeAuction({ status: AuctionStatus.ACTIVE, highestBid: 100, minimumIncrement: 10 });
    
    expect(canPlaceBid(auction, 105)).toBe(false);
  });
})