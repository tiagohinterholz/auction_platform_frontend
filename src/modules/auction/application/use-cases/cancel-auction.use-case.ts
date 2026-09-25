import { fail, type Result } from '@/shared/lib/result';
import { canBeCancelled, type Auction } from '@/modules/auction/domain';
import type { AuctionGateway } from '@/modules/auction/application/ports/auction.gateway';


export async function cancelAuctionUseCase(
  gateway: AuctionGateway,
  auction: Auction,
  reason: string,
): Promise<Result<Auction>> {
  if (reason.trim() === "") {
    return fail({ kind: "Validation", message: "Informe o motivo do cancelamento" });
  }
  if (!canBeCancelled(auction)) {
    return fail({ kind: "Validation", message: "Este leilão não pode ser cancelado" });
  }

  return await gateway.cancelAuction(auction.auctionId, { reason });
}