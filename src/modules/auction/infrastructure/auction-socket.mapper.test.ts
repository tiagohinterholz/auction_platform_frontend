import { describe, expect, it } from 'vitest';
import { mapSocketMessage } from './auction-socket.mapper';

describe("mapSocketMessage", () => {
  it("maps bidPlaced to BidPlaced with a numeric amount", () => {
    const raw = JSON.stringify({ event: "bidPlaced", payload: { auction_id: "a1", amount: "150.00" } });

    const result = mapSocketMessage(raw);

    expect(result).toEqual({ type: "BidPlaced", auctionId: "a1", amount: 150 });
  });
  
  it("maps auctionStarted to AuctionStarted", () =>{
      const raw = JSON.stringify({ event: "auctionStarted", payload: { id: "a1" } });

      const result = mapSocketMessage(raw);

      expect(result).toEqual({ type: "AuctionStarted", auctionId: "a1" });
  })

  it("maps auctionExtended to AuctionExtended", () =>{
      const raw = JSON.stringify({ event: "auctionExtended", payload: { id: "a1", end_time: "2026-06-01T12:00:30Z" } });

      const result = mapSocketMessage(raw);

      expect(result).toEqual({ type: "AuctionExtended", auctionId: "a1", endTime:"2026-06-01T12:00:30Z" });
  })

  it("maps auctionScheduled to AuctionChanged", () =>{
      const raw = JSON.stringify({ event: "auctionScheduled", payload: { id: "a1" } });

      const result = mapSocketMessage(raw);

      expect(result).toEqual({ type: "AuctionChanged", auctionId: "a1" });
  })

  it("returns null for an unknown event", () =>{
      const raw = JSON.stringify({ event: "auctionUnknow" });

      const result = mapSocketMessage(raw);

      expect(result).toEqual(null);
  })

  it("maps invalid JSON", () =>{
      const result = mapSocketMessage("isso não é um JSON");

      expect(result).toBeNull();
  })
});

