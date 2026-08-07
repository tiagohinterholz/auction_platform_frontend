import { api } from "@/api/http";
import type {
  Auction,
  CancelAuctionPayload,
  CreateAuctionPayload,
  ScheduleAuctionPayload,
} from "../types";

/**
 * Backend contract is snake_case, money fields are Decimal serialized as
 * string (see auction_platform_fast_api's AuctionSchema / .bugs.md #1).
 * This is the only place that should know that shape — everything past
 * `mapAuction` deals with the camelCase, numeric `Auction` type.
 */
export function mapAuction(raw: any): Auction {
  return {
    auctionId: raw.id,
    userId: raw.user_id,
    title: raw.title,
    description: raw.description,
    status: raw.status,
    startingPrice: Number(raw.start_price),
    highestBid: Number(raw.highest_bid ?? raw.start_price),
    minimumIncrement: Number(raw.minimum_increment),
    startTime: raw.start_time ?? undefined,
    endTime: raw.end_time ?? undefined,
    images: raw.images ?? [],
  };
}

export class AuctionAPI {
  static async getAuctions(): Promise<Auction[]> {
    const response = await api.get<any[]>("/auctions");
    return response.data.map(mapAuction);
  }

  static async getById(id: string): Promise<Auction> {
    const response = await api.get<any>(`/auctions/${id}`);
    return mapAuction(response.data);
  }

  static async getMyAuctions(): Promise<Auction[]> {
    const response = await api.get<any[]>("/auctions/me");
    return response.data.map(mapAuction);
  }

  static async create(payload: CreateAuctionPayload): Promise<Auction> {
    const response = await api.post<any>("/auctions", {
      title: payload.title,
      description: payload.description,
      start_price: payload.startingPrice,
      minimum_increment: payload.minimumIncrement,
      images: payload.images,
    });
    return mapAuction(response.data);
  }

  static async schedule(
    id: string,
    payload: ScheduleAuctionPayload,
  ): Promise<Auction> {
    const response = await api.patch<any>(`/auctions/${id}/schedule`, {
      start_date: new Date(payload.startTime).toISOString(),
      end_date: new Date(payload.endTime).toISOString(),
    });
    return mapAuction(response.data);
  }

  static async cancel(
    id: string,
    payload: CancelAuctionPayload,
  ): Promise<Auction> {
    const response = await api.patch<any>(`/auctions/${id}/cancel`, {
      reason: payload.reason,
    });
    return mapAuction(response.data);
  }
}
