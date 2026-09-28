import type { AuctionRealtime } from '../application/ports/auction-realtime';
import type { AuctionEvent } from '../domain';
import { mapSocketMessage } from './auction-socket.mapper';


function toWebSocketUrl(auctionId: string): string {
    const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/v1";
    const wsBase = apiUrl.replace(/^http/, "ws");
    return `${wsBase}/ws/auctions/${auctionId}`;
  }


export class WsAuctionRealtime implements AuctionRealtime {
  subscribe(auctionId: string, onEvent: (event: AuctionEvent) => void): () => void {
    const socket = new WebSocket(toWebSocketUrl(auctionId));

    socket.onmessage = (msg) => { 
      const event = mapSocketMessage(msg.data); if (event) onEvent(event); 
    };
    
    return () => socket.close();
  };
};