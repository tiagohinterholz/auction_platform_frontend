import { api } from "@/api/http";
import type {
  Auction,
  CancelAuctionPayload,
  CreateAuctionPayload,
  ScheduleAuctionPayload,
} from "../types";

export class AuctionAPI {
  static async getAuctions(): Promise<Auction[]> {
    const response = await api.get<Auction[]>("/auctions/");
    return response.data;
  }

  static async getById(id: string): Promise<Auction> {
    const response = await api.get<Auction>(`/auctions/${id}`);
    return response.data;
  }

  static async create(payload: CreateAuctionPayload): Promise<Auction> {
    const response = await api.post<Auction>("/auctions", payload);
    return response.data;
  }

  static async schedule(
    id: string,
    payload: ScheduleAuctionPayload,
  ): Promise<Auction> {
    const response = await api.patch<Auction>(
      `/auctions/${id}/schedule/`,
      payload,
    );
    return response.data;
  }

  static async finish(id: string): Promise<Auction> {
    const response = await api.patch<Auction>(`/auctions/${id}/finish/`);
    return response.data;
  }

  static async cancel(
    id: string,
    payload: CancelAuctionPayload,
  ): Promise<Auction> {
    const response = await api.patch<Auction>(
      `/auctions/${id}/cancel/`,
      payload,
    );
    return response.data;
  }
}
