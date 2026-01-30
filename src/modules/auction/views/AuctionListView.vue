<template>
  <div class="auction-list">
    <h1>Leilões Disponíveis</h1>

    <div v-if="isLoading" class="loading">
      <p>Carregando leilões...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>Ocorreu um erro ao buscar os leilões: {{ error }}</p>
      <button @click="retryFetch">Tentar Novamente</button>
    </div>

    <div v-else-if="auctions.length > 0" class="auctions-grid">
      <div v-for="auction in auctions" :key="auction.auctionId" class="auction-card">
        <h2>{{ auction.title }}</h2>
        <p><strong>Status:</strong> <span :class="`status-${auction.status.toLowerCase()}`">{{ auction.status }}</span></p>
        <p><strong>Preço Inicial:</strong> R$ {{ auction.startingPrice.toLocaleString('pt-BR') }}</p>
        <p><strong>Incremento Mínimo:</strong> R$ {{ auction.minimumIncrement.toLocaleString('pt-BR') }}</p>
      </div>
    </div>

    <div v-else class="no-auctions">
      <p>Nenhum leilão encontrado no momento.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuctionStore } from '../stores/auction.store';
import { useRoute } from 'vue-router';

const auctionStore = useAuctionStore();
const { auctions, isLoading, error } = storeToRefs(auctionStore);
const route = useRoute();

function fetchAuctionsData() {
  console.log('Fetching auctions...');
  auctionStore.fetchAuctions();
}

function retryFetch() {
  fetchAuctionsData();
}

onMounted(() => {
  fetchAuctionsData();
});

watch(
  () => route.name,
  (newName) => {
    if (newName === 'AuctionList') {
      fetchAuctionsData();
    }
  },
);
</script>

<style scoped>
.auction-list {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  color: #2c3e50;
  margin-bottom: 2rem;
}

.loading, .error, .no-auctions {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: #7f8c8d;
}

.error {
  color: #c0392b;
  border: 1px solid #e74c3c;
  background-color: #fbeae5;
  border-radius: 8px;
}

.error button {
  margin-top: 1rem;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  border-radius: 4px;
  border: 1px solid #c0392b;
  background-color: #e74c3c;
  color: white;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.error button:hover {
  background-color: #c0392b;
}

.auctions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.auction-card {
  border: 1px solid #ecf0f1;
  border-radius: 8px;
  padding: 1.5rem;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.auction-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0,0,0,0.08);
}

.auction-card h2 {
  margin-top: 0;
  font-size: 1.4rem;
  color: #34495e;
}

.auction-card p {
  color: #7f8c8d;
}

.auction-card .status-draft { color: #7f8c8d; }
.auction-card .status-scheduled { color: #2980b9; }
.auction-card .status-active { color: #27ae60; font-weight: bold; }
.auction-card .status-finished { color: #c0392b; }
.auction-card .status-cancelled { color: #95a5a6; text-decoration: line-through; }
</style>
