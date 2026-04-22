<template>
  <div class="create-auction-view">
    <h1>Criar Novo Leilão</h1>

    <form @submit.prevent="handleSubmit" class="auction-form">
      <div class="form-group">
        <label for="id">ID do Leilão:</label>
        <input type="text" id="id" v-model="auctionId" required />
      </div>

      <div class="form-group">
        <label for="title">Título:</label>
        <input type="text" id="title" v-model="title" required />
      </div>

      <div class="form-group">
        <label for="startingPrice">Preço Inicial:</label>
        <input type="number" id="startingPrice" v-model.number="startingPrice" required min="0" />
      </div>

      <div class="form-group">
        <label for="minimumIncrement">Incremento Mínimo:</label>
        <input type="number" id="minimumIncrement" v-model.number="minimumIncrement" required min="1" />
      </div>

      <div class="form-group">
        <label for="images">URL da Imagem (Opcional):</label>
        <input type="text" id="images" v-model="imageUrl" placeholder="http://exemplo.com/imagem.png" />
      </div>

      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Criando...' : 'Criar Leilão' }}
      </button>

      <p v-if="error" class="error-message">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuctionStore } from '../stores/auction.store';
import type { CreateAuctionPayload } from '../types';

const router = useRouter();
const auctionStore = useAuctionStore();

const auctionId = ref('');
const title = ref('');
const startingPrice = ref(0);
const minimumIncrement = ref(1);
const imageUrl = ref('');

const isLoading = ref(false);
const error = ref<string | null>(null);

async function handleSubmit() {
  isLoading.value = true;
  error.value = null;

  const payload: CreateAuctionPayload = {
    id: auctionId.value,
    title: title.value,
    startingPrice: startingPrice.value,
    minimumIncrement: minimumIncrement.value,
    images: imageUrl.value ? [imageUrl.value] : [],
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

<style scoped>
.create-auction-view {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

h1 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 2rem;
}

.auction-form .form-group {
  margin-bottom: 1.5rem;
}

.auction-form label {
  display: block;
  margin-bottom: 0.5rem;
  color: #34495e;
  font-weight: bold;
}

.auction-form input[type="text"],
.auction-form input[type="number"] {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 1rem;
}

.auction-form input[type="text"]:focus,
.auction-form input[type="number"]:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.auction-form button {
  width: 100%;
  padding: 1rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.auction-form button:hover:not(:disabled) {
  background-color: #218838;
}

.auction-form button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: #e74c3c;
  background-color: #fbeae5;
  border: 1px solid #e74c3c;
  padding: 1rem;
  border-radius: 4px;
  margin-top: 1.5rem;
  text-align: center;
}
</style>
