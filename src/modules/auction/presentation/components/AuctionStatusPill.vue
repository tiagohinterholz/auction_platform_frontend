<script setup lang="ts">
import { AuctionStatus, isAuctionActive, type Auction } from '@/modules/auction/domain';
import AuctionTimer from './AuctionTimer.vue';

defineProps<{ auction: Auction }>();

const labels: Record<AuctionStatus, string> = {
  [AuctionStatus.CREATED]: 'Criado',
  [AuctionStatus.SCHEDULED]: 'Agendado',
  [AuctionStatus.ACTIVE]: 'Ao vivo',
  [AuctionStatus.FINISHED]: 'Encerrado',
  [AuctionStatus.CANCELLED]: 'Cancelado',
};

function formatStart(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}
</script>

<template>
  <AuctionTimer
    v-if="isAuctionActive(auction) && auction.endTime"
    :endTime="auction.endTime"
    size="sm"
  />
  <div v-else class="bg-white/5 backdrop-blur-xl p-3 rounded-2xl">
    <span class="text-lg font-black bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
      <template v-if="auction.status === AuctionStatus.SCHEDULED && auction.startTime">
        Começa {{ formatStart(auction.startTime) }}
      </template>
      <template v-else>{{ labels[auction.status] }}</template>
    </span>
  </div>
</template>
