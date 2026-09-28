export type AuctionEvent =
  | { type: "BidPlaced"; auctionId: string; amount: number }
  | { type: "AuctionStarted"; auctionId: string }
  | { type: "AuctionExtended"; auctionId: string; endTime: string }
  | { type: "AuctionChanged"; auctionId: string };   // finished / cancelled / scheduled → recarregar
