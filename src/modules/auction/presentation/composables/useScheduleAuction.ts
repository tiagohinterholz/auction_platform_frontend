import { ref } from 'vue';
import { useAuctionStore } from '../stores/auction.store';
import type { Auction, ScheduleAuctionPayload } from '@/modules/auction/domain';
import type { AuctionGateway } from '@/modules/auction/application/ports/auction.gateway';
import { auctionGateway } from "@/container";


export function useScheduleAuction(gateway: AuctionGateway = auctionGateway) {
  const store = useAuctionStore();
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function execute(auction: Auction, payload: ScheduleAuctionPayload): Promise<boolean> {
    isLoading.value = true;
    error.value = null;

    const result = await gateway.scheduleAuction(auction.auctionId, payload)

    isLoading.value = false;

    if (!result.ok) {
      error.value = result.error.message;
      return false
    }

    store.replaceAuction(result.value);
    
    return true
  }
return { execute, isLoading, error}

}