<template>
  <div class="min-h-screen py-12 px-4 md:px-8 bg-[radial-gradient(circle_at_top_right,_#1e293b_0%,_#0f172a_100%)] text-white">
    <div v-if="isLoading && !currentAuction" class="max-w-7xl mx-auto flex flex-col items-center justify-center py-20">
      <div class="w-12 h-12 border-4 border-sky-400/30 border-t-sky-400 rounded-full animate-spin mb-4"></div>
      <p class="text-slate-400">Buscando detalhes do lote...</p>
    </div>

    <div v-else-if="error && !currentAuction" class="max-w-xl mx-auto pt-10">
      <AppCard class="text-center">
        <div class="text-red-400 text-5xl mb-4">!</div>
        <h2 class="text-2xl font-bold mb-2">Erro ao carregar leilão</h2>
        <p class="text-slate-400 mb-8">{{ error }}</p>
        <AppButton @click="fetchData">Tentar Novamente</AppButton>
      </AppCard>
    </div>

    <div v-else-if="currentAuction" class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10">
      <div class="space-y-8">
        <div class="relative group">
          <AppCard class="p-2 overflow-hidden aspect-video">
            <img
              :src="currentAuction.images?.[0] || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800'"
              :alt="currentAuction.title"
              class="w-full h-full object-cover rounded-2xl transition-transform duration-700 group-hover:scale-105"
            />
            <div
              class="absolute top-6 right-6 px-6 py-2 rounded-full font-black uppercase tracking-widest text-xs shadow-2xl"
              :class="isAuctionActive(currentAuction) ? 'bg-emerald-500 text-white' : 'bg-sky-500 text-white'"
            >
              {{ currentAuction.status }}
            </div>
          </AppCard>
        </div>

        <AppCard>
          <h2 class="text-2xl font-bold mb-6">Sobre este lote</h2>
          <p class="text-slate-400 leading-relaxed mb-8">
            {{ currentAuction.description || 'Item exclusivo em leilão. Lances dados nos últimos 30 segundos estenderão o leilão automaticamente (Anti-Sniping).' }}
          </p>
          <div class="flex flex-wrap gap-12 pt-8 border-t border-white/10">
            <div>
              <span class="block text-slate-500 text-[10px] uppercase font-black mb-1">ID do Leilão</span>
              <span class="text-lg font-bold text-slate-200">#{{ currentAuction.auctionId.slice(0, 8) }}</span>
            </div>
            <div>
              <span class="block text-slate-500 text-[10px] uppercase font-black mb-1">Incremento Mín.</span>
              <span class="text-lg font-bold text-sky-400">R$ {{ currentAuction.minimumIncrement.toLocaleString('pt-BR') }}</span>
            </div>
          </div>
        </AppCard>
      </div>

      <div class="space-y-8">
        <AuctionTimer
          :endTime="currentAuction.endTime"
          @end="handleTimerEnd"
        />

        <AppCard>
          <div class="mb-8">
            <span class="text-slate-500 text-[10px] uppercase font-black">Lance Atual</span>
            <div class="flex items-baseline gap-2 mt-1">
              <span class="text-2xl font-bold text-sky-400 italic">R$</span>
              <span class="text-6xl font-black transition-all">{{ currentAuction.highestBid.toLocaleString('pt-BR') }}</span>
            </div>
            <span class="text-slate-500 text-sm italic">{{ biddingStore.bids.length }} lances registrados</span>
          </div>

          <AppAlert v-if="bidError" type="error" :message="bidError" class="mb-4" />

          <form @submit.prevent="handlePlaceBid" class="space-y-6">
            <div class="relative">
              <span class="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">R$</span>
              <input
                type="number"
                v-model.number="bidAmount"
                :min="nextMinBid"
                class="w-full bg-black/20 border border-white/10 rounded-2xl pl-14 pr-6 py-5 text-2xl font-black text-white focus:outline-none focus:border-sky-400 focus:bg-white/[0.05] transition-all"
                required
              />
            </div>
            <p class="text-center text-slate-500 text-xs">
              Mínimo sugerido: <span class="text-slate-300 font-bold">R$ {{ nextMinBid.toLocaleString('pt-BR') }}</span>
            </p>

            <AppButton
              type="submit"
              class="w-full"
              :disabled="!canPlaceBid(currentAuction, bidAmount) || isBidSubmitting"
            >
              <span v-if="isBidSubmitting">Enviando...</span>
              <span v-else>Dar Lance Agora</span>
            </AppButton>
          </form>

          <div v-if="!isAuthenticated" class="mt-4 text-center">
            <router-link to="/login" class="text-sky-400 text-sm font-bold hover:underline">
              Faça login para dar um lance
            </router-link>
          </div>
        </AppCard>

        <AppCard class="!p-8">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-bold">Últimos Lances</h3>
            <div v-if="isConnected" class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span class="text-xs text-emerald-400 font-bold">AO VIVO</span>
            </div>
          </div>

          <div v-if="biddingStore.isLoading && biddingStore.bids.length === 0" class="text-center py-8 text-slate-500">
            Carregando lances...
          </div>

          <div v-else-if="biddingStore.bids.length === 0" class="text-center py-8 text-slate-500">
            Nenhum lance registrado ainda. Seja o primeiro!
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="bid in biddingStore.bids.slice(0, 10)"
              :key="bid.id"
              class="flex justify-between items-center p-4 bg-white/[0.02] border border-white/[0.05] rounded-xl hover:bg-white/[0.05] transition-colors"
            >
              <div>
                <span class="block text-sm font-bold text-slate-200">Usuário #{{ bid.userId.slice(0, 6) }}</span>
                <span class="text-[10px] text-slate-500 uppercase">{{ formatDate(bid.createdAt) }}</span>
              </div>
              <span class="text-sky-400 font-black">R$ {{ bid.amount.toLocaleString('pt-BR') }}</span>
            </div>
          </div>
        </AppCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuctionStore } from '../stores/auction.store';
import { useBiddingStore } from '@/modules/bidding';
import { useAuthStore } from '@/modules/auth';
import { useAuctionSocket } from '../composables/useAuctionSocket';
import { storeToRefs } from 'pinia';
import { canPlaceBid, isAuctionActive, minNextBid } from '@/modules/auction/domain';
import AuctionTimer from '@/modules/auction/presentation/components/AuctionTimer.vue';
import AppCard from '@/components/AppCard.vue';
import AppButton from '@/components/AppButton.vue';
import AppAlert from '@/components/AppAlert.vue';

const route = useRoute();
const auctionStore = useAuctionStore();
const biddingStore = useBiddingStore();
const authStore = useAuthStore();
const { currentAuction, isLoading, error } = storeToRefs(auctionStore);
const { isAuthenticated } = storeToRefs(authStore);

const auctionId = route.params.id as string;
const { connect, isConnected } = useAuctionSocket(auctionId);

const bidAmount = ref(0);
const isBidSubmitting = ref(false);
const bidError = ref<string | null>(null);
  
const fetchData = async () => {
  await Promise.all([
    auctionStore.fetchAuctionById(auctionId),
    biddingStore.fetchBids(auctionId),
  ]);
  
  if (currentAuction.value) {
    bidAmount.value = nextMinBid.value;
  }
};

const nextMinBid = computed(() =>
  currentAuction.value ? minNextBid(currentAuction.value) : 0
);
  
watch(() => currentAuction.value?.highestBid, () => {
  if (bidAmount.value < nextMinBid.value) {
    bidAmount.value = nextMinBid.value;
  }
});

function handleTimerEnd() {
  fetchData();
}

async function handlePlaceBid() {
  if (!isAuthenticated.value) return;
  bidError.value = null;
  isBidSubmitting.value = true;

  const success = await biddingStore.placeBid(auctionId, bidAmount.value);

  if (!success) {
    bidError.value = biddingStore.error;
  } else {
    await biddingStore.fetchBids(auctionId);
  }

  isBidSubmitting.value = false;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}


onMounted(async () => {
  biddingStore.clearBids();
  await fetchData();
  connect();
});
</script>
