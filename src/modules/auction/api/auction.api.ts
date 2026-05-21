import { api } from "@/api/http";
import type {
  Auction,
  CancelAuctionPayload,
  CreateAuctionPayload,
  ScheduleAuctionPayload,
} from "../types";

function mapAuction(raw: any): Auction {
  return {
    auctionId: raw.id,
    title: raw.title,
    description: raw.description,
    status: raw.status,
    startingPrice: raw.start_price,
    minimumIncrement: raw.minimum_increment,
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

  static async create(payload: CreateAuctionPayload): Promise<Auction> {
    const body = {
      title: payload.title,
      description: payload.description,
      start_price: payload.startingPrice,
      minimum_increment: payload.minimumIncrement,
      images: payload.images,
    };
    const response = await api.post<any>("/auctions", body);
    return mapAuction(response.data);
  }

  static async schedule(
    id: string,
    payload: ScheduleAuctionPayload,
  ): Promise<Auction> {
    const body = {
      start_time: payload.startTime,
      end_time: payload.endTime,
    };
    const response = await api.patch<Auction>(
      `/auctions/${id}/schedule`,
      body,
    );
    return response.data;
  }

  static async finish(id: string): Promise<Auction> {
    const response = await api.patch<Auction>(`/auctions/${id}/finish`);
    return response.data;
  }

  static async cancel(
    id: string,
    payload: CancelAuctionPayload,
  ): Promise<Auction> {
    const response = await api.patch<Auction>(
      `/auctions/${id}/cancel`,
      payload.reason,
    );
    return response.data;
  }
}
