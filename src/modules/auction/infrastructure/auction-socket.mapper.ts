import type { AuctionEvent } from '../domain/auction-events';

export function mapSocketMessage(raw: string): AuctionEvent | null {
    let message: { event: string; payload: Record<string, any> };;
    try {
      message = JSON.parse(raw);
    } catch {
      return null;
    }

    const { event, payload } = message;

    switch (event) {
      case "bidPlaced":
        return { type: "BidPlaced", auctionId: payload.auction_id, amount: Number(payload.amount) };
      
      case "auctionStarted":
        return { type: "AuctionStarted", auctionId: payload.id };

      case "auctionExtended":
        return { type: "AuctionExtended", auctionId: payload.id, endTime: payload.end_time };

      case "auctionFinished":
      case "auctionCancelled":
      case "auctionScheduled":
        return { type: "AuctionChanged", auctionId: payload.id };

      default:
        return null;
    }
  }