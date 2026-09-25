import type { AuctionGateway } from "@/modules/auction/application/ports/auction.gateway";
import { HttpAuctionGateway } from "@/modules/auction/infrastructure/http-auction.gateway";

export const auctionGateway: AuctionGateway = new HttpAuctionGateway();
