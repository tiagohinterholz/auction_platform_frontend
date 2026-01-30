import { api } from '@/api/http';
import type {
  Auction,
  CancelAuctionPayload,
  CreateAuctionPayload,
  ScheduleAuctionPayload,
} from '../types';

export async function getAuctions(): Promise<Auction[]> {
  const response = await api.get<Auction[]>('/auctions/');
  return response.data;
}

export async function getAuctionById(id: string): Promise<Auction> {
  const response = await api.get<Auction>(`/auctions/${id}`);
  return response.data;
}

export async function createAuction(payload: CreateAuctionPayload): Promise<Auction> {
  const response = await api.post<Auction>('/auctions', payload);
  return response.data;
}

export async function scheduleAuction(
  id: string,
  payload: ScheduleAuctionPayload,
): Promise<Auction> {
  const response = await api.patch<Auction>(`/auctions/${id}/schedule/`, payload);
  return response.data;
}

export async function finishAuction(id: string): Promise<Auction> {
  const response = await api.patch<Auction>(`/auctions/${id}/finish/`);
  return response.data;
}

export async function cancelAuction(id: string, payload: CancelAuctionPayload): Promise<Auction> {
  const response = await api.patch<Auction>(`/auctions/${id}/cancel/`, payload);
  return response.data;
}
