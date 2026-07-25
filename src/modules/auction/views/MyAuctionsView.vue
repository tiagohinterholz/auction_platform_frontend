<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuctionStore } from '../stores/auction.store';
import { storeToRefs } from 'pinia';
import { AuctionStatus, type Auction } from '../types';
import AppCard from '@/components/AppCard.vue';
import AppButton from '@/components/AppButton.vue';
import AppAlert from '@/components/AppAlert.vue';

const router = useRouter();
const auctionStore = useAuctionStore();
const { myAuctions, isLoading, error } = storeToRefs(auctionStore);

// --- Modal de agendamento ---
const showScheduleModal = ref(false);
const selectedAuction = ref<Auction | null>(null);
const scheduleForm = reactive({ startTime: '', endTime: '' });

function openScheduleModal(auction: Auction) {
  selectedAuction.value = auction;
  scheduleForm.startTime = '';
  scheduleForm.endTime = '';
  showScheduleModal.value = true;
}

async function confirmSchedule() {
  if (!selectedAuction.value) return;
  await auctionStore.scheduleAuction(selectedAuction.value.auctionId, {
    startTime: scheduleForm.startTime,
    endTime: scheduleForm.endTime,
  });
  showScheduleModal.value = false;
}


const showCancelModal = ref(false);
const cancelReason = ref('');

function openCancelModal(auction: Auction) {
  selectedAuction.value = auction;
  cancelReason.value = '';
  showCancelModal.value = true;
}

async function confirmCancel() {
  if (!selectedAuction.value) return;
  await auctionStore.cancelAuction(selectedAuction.value.auctionId, {
    reason: cancelReason.value || undefined,
  });
  showCancelModal.value = false;
}

// --- Navegação ---
function goToDetail(id: string) {
  router.push(`/auctions/${id}`);
}

onMounted(() => {
  auctionStore.fetchMyAuctions();
});
</script>

<template>
  <div>
    <div class="min-h-screen py-12 px-4 md:px-8 bg-[radial-gradient(circle_at_top_right,_#1e293b_0%,_#0f172a_100%)] text-white">
      <div class="max-w-5xl mx-auto">

        <header class="mb-10">
          <h1 class="text-4xl font-black tracking-tight mb-1">Meus Leilões</h1>
          <p class="text-slate-400">Gerencie todos os seus leilões em um só lugar.</p>
        </header>

        <!-- Loading -->
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-24">
          <div class="w-12 h-12 border-4 border-sky-400/30 border-t-sky-400 rounded-full animate-spin mb-4"></div>
          <p class="text-slate-400 italic">Carregando seus leilões...</p>
        </div>

        <!-- Erro -->
        <AppAlert v-else-if="error" type="error" :message="error" />

        <!-- Lista -->
        <div v-else-if="myAuctions.length > 0" class="flex flex-col gap-4">
          <AppCard
            v-for="auction in myAuctions"
            :key="auction.auctionId"
            class="flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <!-- Info -->
            <div class="flex items-center gap-4 cursor-pointer flex-1" @click="goToDetail(auction.auctionId)">
              <img
                :src="auction.images?.[0] || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=200'"
                :alt="auction.title"
                class="w-16 h-16 rounded-xl object-cover flex-shrink-0"
              />
              <div>
                <h3 class="font-bold text-white hover:text-sky-400 transition-colors">{{ auction.title }}</h3>
                <p class="text-slate-400 text-sm mt-0.5">R$ {{ auction.startingPrice.toLocaleString('pt-BR') }}</p>
              </div>
            </div>

            <!-- Status badge -->
            <span
              class="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full self-start md:self-auto"
              :class="{
                'bg-slate-700 text-slate-300 border border-white/10': auction.status === 'created',
                'bg-sky-400/20 text-sky-400 border border-sky-400/30': auction.status === 'scheduled',
                'bg-green-400/20 text-green-400 border border-green-400/30': auction.status === 'active',
                'bg-slate-600/40 text-slate-400 border border-white/10': auction.status === 'finished',
                'bg-red-400/20 text-red-400 border border-red-400/30': auction.status === 'cancelled',
              }"
            >
              {{ auction.status }}
            </span>

            <!-- Ações -->
            <div class="flex gap-2 flex-shrink-0">
              <template v-if="auction.status === AuctionStatus.CREATED">
                <AppButton variant="primary" @click="openScheduleModal(auction)">Agendar</AppButton>
                <AppButton variant="secondary" @click="openCancelModal(auction)">Cancelar</AppButton>
              </template>
              <template v-else-if="auction.status === AuctionStatus.SCHEDULED">
                <AppButton variant="secondary" @click="openCancelModal(auction)">Cancelar</AppButton>
              </template>
            </div>
          </AppCard>
        </div>

        <!-- Empty state -->
        <div v-else class="text-center py-24">
          <p class="text-slate-500 text-xl mb-6">Você ainda não criou nenhum leilão.</p>
          <AppButton @click="router.push('/auctions/create')">Criar Leilão</AppButton>
        </div>

      </div>
  </div>

  <Teleport to="body">
    <div v-if="showScheduleModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <AppCard class="w-full max-w-md">
        <h2 class="text-xl font-bold mb-6">Agendar Leilão</h2>
        <div class="flex flex-col gap-4">
          <div>
            <label class="text-sm text-slate-400 mb-1 block">Início</label>
            <input
              v-model="scheduleForm.startTime"
              type="datetime-local"
              class="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
            />
          </div>
          <div>
            <label class="text-sm text-slate-400 mb-1 block">Fim</label>
            <input
              v-model="scheduleForm.endTime"
              type="datetime-local"
              class="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
            />
          </div>
        </div>
        <div class="flex gap-3 mt-6 justify-end">
          <AppButton variant="secondary" @click="showScheduleModal = false">Cancelar</AppButton>
          <AppButton variant="primary" :loading="isLoading" @click="confirmSchedule">Confirmar</AppButton>
        </div>
      </AppCard>
    </div>
  </Teleport>

  <!-- Modal: Cancelar -->
  <Teleport to="body">
    <div v-if="showCancelModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <AppCard class="w-full max-w-md">
        <h2 class="text-xl font-bold mb-2">Cancelar Leilão</h2>
        <p class="text-slate-400 text-sm mb-6">Informe o motivo do cancelamento (opcional).</p>
        <textarea
          v-model="cancelReason"
          rows="3"
          placeholder="Motivo do cancelamento..."
          class="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all resize-none"
        />
        <div class="flex gap-3 mt-6 justify-end">
          <AppButton variant="secondary" @click="showCancelModal = false">Voltar</AppButton>
          <AppButton
            class="!border-red-500/30 !text-red-400 hover:!bg-red-500/10"
            variant="secondary"
            :loading="isLoading"
            @click="confirmCancel"
          >
            Confirmar Cancelamento
          </AppButton>
        </div>
      </AppCard>
    </div>
  </Teleport>
  </div>
</template>
