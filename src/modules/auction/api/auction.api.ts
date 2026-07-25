import { api } from "@/api/http";
import type {
  Auction,
  CancelAuctionPayload,
  CreateAuctionPayload,
  ScheduleAuctionPayload,
} from "../types";

function mapAuction(raw: any): Auction {
  return {
    auctionId: raw.auctionId,
    title: raw.title,
    description: raw.description,
    status: raw.status,
    startingPrice: raw.startingPrice,
    highestBid: raw.highestBid ?? raw.startingPrice,
    minimumIncrement: raw.minimumIncrement,
    startTime: raw.startTime ?? undefined,
    endTime: raw.endTime ?? undefined,
    images: raw.images ?? [],
    userId: raw.userId,
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
      startingPrice: payload.startingPrice,
      minimumIncrement: payload.minimumIncrement,
      images: payload.images,
    });
    return mapAuction(response.data);
  }

  static async schedule(
    id: string,
    payload: ScheduleAuctionPayload,
  ): Promise<Auction> {
    const response = await api.patch<any>(`/auctions/${id}/schedule`, {
      startTime: payload.startTime,
      endTime: payload.endTime,
    });
    return mapAuction(response.data);
  }

  static async finish(id: string): Promise<Auction> {
    const response = await api.patch<any>(`/auctions/${id}/finish`);
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
