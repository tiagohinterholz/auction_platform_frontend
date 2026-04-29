<template>
  <div class="min-h-screen py-12 px-4 md:px-8 bg-[radial-gradient(circle_at_top_right,_#1e293b_0%,_#0f172a_100%)] text-white">
    <div class="max-w-7xl mx-auto">
      
      <!-- Header da Lista -->
      <header class="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
        <div>
          <h1 class="text-4xl font-black tracking-tight mb-2">Leilões Ativos</h1>
          <p class="text-slate-400 text-lg">Encontre as melhores oportunidades e dê o seu lance agora mesmo.</p>
        </div>
        <AppButton @click="router.push('/auctions/create')">
          <span class="text-2xl mr-2">+</span> Novo Leilão
        </AppButton>
      </header>

      <!-- Estados de Loading e Erro -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-24">
        <div class="w-12 h-12 border-4 border-sky-400/30 border-t-sky-400 rounded-full animate-spin mb-4"></div>
        <p class="text-slate-400 italic">Sincronizando com o martelo...</p>
      </div>

      <div v-else-if="error" class="max-w-md mx-auto">
        <AppCard class="text-center">
          <div class="text-red-400 text-5xl mb-4">!</div>
          <h2 class="text-xl font-bold mb-2">Ops! Algo deu errado</h2>
          <p class="text-slate-400 mb-6">{{ error }}</p>
          <AppButton variant="secondary" @click="retryFetch">Tentar Novamente</AppButton>
        </AppCard>
      </div>

      <!-- Grid de Leilões -->
      <div v-else-if="auctions.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <AppCard 
          v-for="auction in auctions" 
          :key="auction.auctionId"
          class="!p-0 group cursor-pointer hover:border-sky-400/50 transition-all duration-500 overflow-hidden"
          @click="goToDetails(auction.auctionId)"
        >
          <!-- Imagem com Overlay de Status -->
          <div class="relative aspect-video overflow-hidden">
            <img 
              :src="auction.images?.[0] || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800'" 
              :alt="auction.title"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div class="absolute top-4 left-4">
              <span class="px-3 py-1 bg-sky-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-xl">
                {{ auction.status }}
              </span>
            </div>
            <!-- Timer Pequeno sobre a imagem -->
            <div class="absolute bottom-4 right-4">
              <AuctionTimer :endTime="auction.endTime" size="sm" />
            </div>
          </div>

          <!-- Conteúdo do Card -->
          <div class="p-6 space-y-4">
            <h3 class="text-lg font-bold line-clamp-1 group-hover:text-sky-400 transition-colors">
              {{ auction.title }}
            </h3>
            
            <div class="flex justify-between items-end">
              <div>
                <span class="text-[10px] text-slate-500 uppercase font-black block mb-1">Lance Atual</span>
                <div class="flex items-baseline gap-1">
                  <span class="text-sky-400 font-bold text-sm">R$</span>
                  <span class="text-2xl font-black text-slate-100">
                    {{ auction.startingPrice.toLocaleString('pt-BR') }}
                  </span>
                </div>
              </div>
              <div class="text-right">
                <span class="text-[10px] text-slate-600 font-bold block">#{{ auction.auctionId.slice(0,6) }}</span>
                <span class="text-sky-400 text-xs font-bold underline">Ver Lote</span>
              </div>
            </div>
          </div>
        </AppCard>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-24">
        <p class="text-slate-500 text-xl">Nenhum leilão ativo no momento.</p>
        <AppButton variant="secondary" class="mt-6" @click="router.push('/auctions/create')">
          Criar Leilão
        </AppButton>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuctionStore } from '../stores/auction.store';
import { storeToRefs } from 'pinia';

// Componentes
import AppButton from '@/components/AppButton.vue';
import AppCard from '@/components/AppCard.vue';
import AuctionTimer from '@/modules/auction/components/AuctionTimer.vue';

const router = useRouter();
const auctionStore = useAuctionStore();
const { auctions, isLoading, error } = storeToRefs(auctionStore);

const fetchData = async () => {
  await auctionStore.fetchAuctions();
};

const retryFetch = () => {
  fetchData();
};

const goToDetails = (id: string) => {
  router.push(`/auctions/${id}`);
};

onMounted(() => {
  fetchData();
});
</script>