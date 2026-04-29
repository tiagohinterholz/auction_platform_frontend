<template>
  <!-- Container principal com o gradiente que estava no CSS -->
  <div class="min-h-screen py-12 px-4 md:px-8 bg-[radial-gradient(circle_at_top_right,_#1e293b_0%,_#0f172a_100%)] text-white">
    
    <!-- Estados de Loading e Erro usando AppAlert -->
    <div v-if="isLoading" class="max-w-7xl mx-auto flex flex-col items-center justify-center py-20">
      <div class="w-12 h-12 border-4 border-sky-400/30 border-t-sky-400 rounded-full animate-spin mb-4"></div>
      <p class="text-slate-400">Buscando detalhes do lote...</p>
    </div>

    <div v-else-if="error" class="max-w-xl mx-auto pt-10">
      <AppCard class="text-center">
        <div class="text-red-400 text-5xl mb-4">!</div>
        <h2 class="text-2xl font-bold mb-2">Erro ao carregar leilão</h2>
        <p class="text-slate-400 mb-8">{{ error }}</p>
        <AppButton @click="fetchData">Tentar Novamente</AppButton>
      </AppCard>
    </div>

    <!-- Conteúdo Principal -->
    <div v-else-if="auction" class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10">
      
      <!-- Coluna Esquerda: Imagem e Descrição -->
      <div class="space-y-8">
        <div class="relative group">
          <AppCard class="p-2 overflow-hidden aspect-video">
            <img 
              :src="auction.images?.[0] || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800'" 
              :alt="auction.title" 
              class="w-full h-full object-cover rounded-2xl transition-transform duration-700 group-hover:scale-105"
            />
            <div 
              class="absolute top-6 right-6 px-6 py-2 rounded-full font-black uppercase tracking-widest text-xs shadow-2xl"
              :class="auction.status === 'ACTIVE' ? 'bg-emerald-500 text-white' : 'bg-sky-500 text-white'"
            >
              {{ auction.status }}
            </div>
          </AppCard>
        </div>

        <AppCard>
          <h2 class="text-2xl font-bold mb-6">Sobre este lote</h2>
          <p class="text-slate-400 leading-relaxed mb-8">
            Este é um item exclusivo em leilão. Certifique-se de revisar as regras de incremento 
            mínimo e o tempo restante antes de confirmar seu lance. Lances dados nos últimos 
            30 segundos estenderão o leilão automaticamente (Anti-Sniping).
          </p>
          <div class="flex flex-wrap gap-12 pt-8 border-t border-white/10">
            <div>
              <span class="block text-slate-500 text-[10px] uppercase font-black mb-1">ID do Leilão</span>
              <span class="text-lg font-bold text-slate-200">#{{ auction.auctionId.slice(0, 8) }}</span>
            </div>
            <div>
              <span class="block text-slate-500 text-[10px] uppercase font-black mb-1">Incremento Mín.</span>
              <span class="text-lg font-bold text-sky-400">R$ {{ auction.minimumIncrement.toLocaleString('pt-BR') }}</span>
            </div>
          </div>
        </AppCard>
      </div>

      <!-- Coluna Direita: Bidding & Stats -->
      <div class="space-y-8">
        <!-- Componente do Timer que extraímos -->
        <AuctionTimer 
          :endTime="auction.endTime" 
          @end="handleTimerEnd" 
        />

        <!-- Card de Lances -->
        <AppCard>
          <div class="mb-8">
            <span class="text-slate-500 text-[10px] uppercase font-black">Lance Atual</span>
            <div class="flex items-baseline gap-2 mt-1">
              <span class="text-2xl font-bold text-sky-400 italic">R$</span>
              <span class="text-6xl font-black">{{ auction.startingPrice.toLocaleString('pt-BR') }}</span>
            </div>
            <span class="text-slate-500 text-sm italic">12 lances registrados</span>
          </div>

          <form @submit.prevent="handlePlaceBid" class="space-y-6">
            <div class="relative">
              <span class="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">R$</span>
              <input 
                type="number" 
                v-model.number="bidAmount" 
                :min="minNextBid"
                class="w-full bg-black/20 border border-white/10 rounded-2xl pl-14 pr-6 py-5 text-2xl font-black text-white focus:outline-none focus:border-sky-400 focus:bg-white/[0.05] transition-all"
                required
              />
            </div>
            <p class="text-center text-slate-500 text-xs">
              Mínimo sugerido: <span class="text-slate-300 font-bold">R$ {{ minNextBid.toLocaleString('pt-BR') }}</span>
            </p>
            
            <AppButton type="submit" class="w-full" :disabled="!isAuctionActive">
              Dar Lance Agora
            </AppButton>
          </form>
        </AppCard>

        <!-- Histórico (Pode ser um componente futuro) -->
        <AppCard class="!p-8">
          <h3 class="text-lg font-bold mb-6">Últimos Lances</h3>
          <div class="space-y-4">
            <div v-for="i in 5" :key="i" class="flex justify-between items-center p-4 bg-white/[0.02] border border-white/[0.05] rounded-xl hover:bg-white/[0.05] transition-colors">
              <div>
                <span class="block text-sm font-bold text-slate-200">Usuário #{{ 1234 + i }}</span>
                <span class="text-[10px] text-slate-500 uppercase">há {{ i * 2 }} minutos</span>
              </div>
              <span class="text-sky-400 font-black">R$ {{ (auction.startingPrice - (i * 500)).toLocaleString('pt-BR') }}</span>
            </div>
          </div>
          <button class="w-full mt-6 text-slate-500 hover:text-white text-sm font-bold transition-colors uppercase tracking-widest text-[10px]">
            Ver Histórico Completo
          </button>
        </AppCard>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuctionStore } from '../stores/auction.store';
import { storeToRefs } from 'pinia';
import { AuctionStatus } from '../types';

// Componentes Base e Específicos
import AuctionTimer from '@/modules/auction/components/AuctionTimer.vue';
import AppCard from '@/components/AppCard.vue';
import AppButton from '@/components/AppButton.vue';

const route = useRoute();
const auctionStore = useAuctionStore();
const { currentAuction: auction, isLoading, error } = storeToRefs(auctionStore);

const bidAmount = ref(0);

const fetchData = async () => {
  await auctionStore.fetchAuctionById(route.params.id as string);
  if (auction.value) {
    bidAmount.value = auction.value.startingPrice + auction.value.minimumIncrement;
  }
};

const minNextBid = computed(() => {
  if (!auction.value) return 0;
  return auction.value.startingPrice + auction.value.minimumIncrement;
});

const isAuctionActive = computed(() => {
  return auction.value?.status === AuctionStatus.ACTIVE;
});

function handleTimerEnd() {
  console.log("Leilão encerrado!");
  fetchData(); 
}

async function handlePlaceBid() {
  alert(`Lance de R$ ${bidAmount.value} em desenvolvimento!`);
}

onMounted(() => {
  fetchData();
});
</script>
