import type { AuctionEvent } from '@/modules/auction/domain';

export interface AuctionRealtime {
  subscribe(auctionId: string, onEvent: (event: AuctionEvent) => void): () => void;
}
