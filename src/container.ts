import type { AuctionGateway } from "@/modules/auction/application/ports/auction.gateway";
import { HttpAuctionGateway } from "@/modules/auction/infrastructure/http-auction.gateway";
import type { BiddingGateway } from '@/modules/bidding/application/ports/bidding.gateway';
import { HttpBiddingGateway } from '@/modules/bidding/infrastructure/http-bidding.gateway';

export const auctionGateway: AuctionGateway = new HttpAuctionGateway();
export const biddingGateway: BiddingGateway = new HttpBiddingGateway();
