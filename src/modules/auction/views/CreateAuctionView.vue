<template>
  <!-- Background com gradiente radial via Tailwind -->
  <div class="min-h-screen py-12 px-4 bg-[radial-gradient(circle_at_top_right,_#1e293b_0%,_#0f172a_100%)] flex justify-center items-start">
    <div class="w-full max-w-2xl">
      <AppCard>
        <h1 class="text-white text-4xl font-bold mb-2 tracking-tight">Criar Novo Leilão</h1>
        <p class="text-slate-400 text-lg mb-10">Preencha os detalhes para iniciar um novo leilão na plataforma.</p>
        <form @submit.prevent="handleSubmit" class="space-y-10">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <AppFormField label="Título do Leilão" htmlFor="title" fullWidth>
              <input 
                id="title" v-model="title" type="text" required
                placeholder="Ex: iPhone 15 Pro Max - Lote 01"
                class="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-sky-400 focus:bg-white/[0.07] transition-all"
              />
            </AppFormField>
            <AppFormField label="Preço Inicial (R$)" htmlFor="startingPrice">
              <AppCurrencyInput id="startingPrice" v-model="startingPrice" :min="0" required />
            </AppFormField>
            <AppFormField label="Incremento Mínimo (R$)" htmlFor="minimumIncrement">
              <AppCurrencyInput id="minimumIncrement" v-model="minimumIncrement" :min="1" required />
            </AppFormField>
            <AppFormField 
              label="URL da Imagem do Produto" 
              htmlFor="images" 
              fullWidth 
              helpText="Insira um link direto para a imagem principal do lote."
            >
              <input 
                id="images" v-model="imageUrl" type="text"
                placeholder="https://sua-imagem.com/produto.png"
                class="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-sky-400 focus:bg-white/[0.07] transition-all"
              />
            </AppFormField>
            <AppFormField label="Data de Início" htmlFor="startTime">
              <input 
                id="startTime" v-model="startTime" type="datetime-local" required
                class="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-sky-400 transition-all [color-scheme:dark]"
              />
            </AppFormField>
            <AppFormField label="Data de Término" htmlFor="endTime">
              <input 
                id="endTime" v-model="endTime" type="datetime-local" required
                class="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-sky-400 transition-all [color-scheme:dark]"
              />
            </AppFormField>
          </div>
          <div class="flex flex-col-reverse md:flex-row gap-4 justify-end">
            <AppButton variant="secondary" @click="router.back()">
              Cancelar
            </AppButton>
            <AppButton type="submit" :loading="isLoading">
              Publicar Leilão
            </AppButton>
          </div>
          <AppAlert :message="error || ''" type="error" />
        </form>
      </AppCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuctionStore } from '../stores/auction.store';
import type { CreateAuctionPayload } from '../types';
import AppButton from '@/components/AppButton.vue';
import AppCard from '@/components/AppCard.vue';
import AppFormField from '@/components/AppFormField.vue';
import AppAlert from '@/components/AppAlert.vue';
import AppCurrencyInput from '@/components/AppCurrencyInput.vue';

const router = useRouter();
const auctionStore = useAuctionStore();

const title = ref('');
const startingPrice = ref(0);
const minimumIncrement = ref(1);
const imageUrl = ref('');

const getFutureDate = (hours: number) => {
  const d = new Date();
  d.setHours(d.getHours() + hours);
  d.setMinutes(0);
  return d.toISOString().slice(0, 16);
};

const startTime = ref(getFutureDate(1));
const endTime = ref(getFutureDate(25));

const isLoading = ref(false);
const error = ref<string | null>(null);

async function handleSubmit() {
  isLoading.value = true;
  error.value = null;

  const payload: CreateAuctionPayload = {
    title: title.value,
    description: 'Leilão criado via plataforma premium.', // Placeholder for now
    startingPrice: startingPrice.value,
    minimumIncrement: minimumIncrement.value,
    images: imageUrl.value ? [imageUrl.value] : [],
    startTime: new Date(startTime.value).toISOString(),
    endTime: new Date(endTime.value).toISOString(),
  };

  try {
    const newAuction = await auctionStore.createAuction(payload);
    if (newAuction) {
      router.push(`/auctions/`);
    } else {
      error.value = auctionStore.error;
    }
  } catch (e: any) {
    error.value = e.message || 'Erro desconhecido ao criar leilão.';
  } finally {
    isLoading.value = false;
  }
}
</script>