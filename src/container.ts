import type { AuctionGateway } from "@/modules/auction/application/ports/auction.gateway";
import { HttpAuctionGateway } from "@/modules/auction/infrastructure/http-auction.gateway";
import type { BiddingGateway } from '@/modules/bidding/application/ports/bidding.gateway';
import { HttpBiddingGateway } from '@/modules/bidding/infrastructure/http-bidding.gateway';
import type { AuctionRealtime } from '@/modules/auction/application/ports/auction-realtime';
import { WsAuctionRealtime } from '@/modules/auction/infrastructure/ws-auction-realtime';

export const auctionGateway: AuctionGateway = new HttpAuctionGateway();
export const biddingGateway: BiddingGateway = new HttpBiddingGateway();
export const auctionRealtime: AuctionRealtime = new WsAuctionRealtime();