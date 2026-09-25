import { api } from "@/api/http";
import type {
  Auction,
  CancelAuctionPayload,
  CreateAuctionPayload,
  ScheduleAuctionPayload,
} from "@/modules/auction/domain";
import type { AuctionGateway } from '../application/ports/auction.gateway';
import { type AppError, type Result, ok, fail } from '@/shared/lib/result';

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

export function toAppError(error: any): AppError {
  const status = error.response?.status;
  const message = error.response?.data?.detail ?? error.response?.data?.message ?? "Erro inesperado";
  if (status === 400 || status === 422) return { kind: "Validation", message };
  if (status === 401) return { kind: "Unauthorized", message };
  if (status === 403) return { kind: "Forbidden", message };
  if (status === 404) return { kind: "NotFound", message };
  return { kind: "Unexpected", message };
}

export class HttpAuctionGateway implements AuctionGateway {
  async getAuctions(): Promise<Result<Auction[]>> {
    try {
      const response = await api.get<any[]>("/auctions");
      return ok(response.data.map(mapAuction));
    } catch (error) {
      return fail(toAppError(error));
    }
  }

  async getAuctionById(id: string): Promise<Result<Auction>> {
    try {
      const response = await api.get<any>(`/auctions/${id}`);
      return ok(mapAuction(response.data));
    } catch (error) {
      return fail(toAppError(error));
    }
  }

  async getMyAuctions(): Promise<Result<Auction[]>> {
    try {
      const response = await api.get<any[]>("/auctions/me");
      return ok(response.data.map(mapAuction));
    } catch (error) {
      return fail(toAppError(error));
    }
  }

  async createAuction(payload: CreateAuctionPayload): Promise<Result<Auction>> {
    try {
      const response = await api.post<any>("/auctions", {
        title: payload.title,
        description: payload.description,
        start_price: payload.startingPrice,
        minimum_increment: payload.minimumIncrement,
        images: payload.images,
      });
      return ok(mapAuction(response.data));
    } catch (error) {
      return fail(toAppError(error));
    }
  }

  async scheduleAuction(
    id: string,
    payload: ScheduleAuctionPayload,
  ): Promise<Result<Auction>> {
    try {
      const response = await api.patch<any>(`/auctions/${id}/schedule`, {
        start_date: new Date(payload.startTime).toISOString(),
        end_date: new Date(payload.endTime).toISOString(),
      });
      return ok(mapAuction(response.data));
    } catch (error) {
      return fail(toAppError(error));
    }
  }

  async cancelAuction(
    id: string,
    payload: CancelAuctionPayload,
  ): Promise<Result<Auction>> {
    try {
      const response = await api.patch<any>(`/auctions/${id}/cancel`, {
        reason: payload.reason,
      });
      return ok(mapAuction(response.data));
    } catch (error) {
      return fail(toAppError(error));
    }
  }
}
