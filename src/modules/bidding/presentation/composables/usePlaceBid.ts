import { ref } from 'vue';
import { useBiddingStore } from '../stores/bidding.store';
import type { BiddingGateway } from '../../application/ports/bidding.gateway';
import { biddingGateway } from '@/container';


export function usePlaceBid(gateway: BiddingGateway = biddingGateway) {
  const store = useBiddingStore();
  const isLoading = ref(false);
  const error = ref<string | null>(null);


  async function execute(auctionId: string, amount: number): Promise<boolean> {
    isLoading.value = true;
    error.value = null;

    const result = await gateway.placeBid(auctionId, { amount });

    if (!result.ok) {
      error.value = result.error.message;
      isLoading.value = false;
      return false;
    }
    await store.fetchBids(auctionId);
    isLoading.value = false;
    return true;
  }

  return { execute, isLoading, error}
}