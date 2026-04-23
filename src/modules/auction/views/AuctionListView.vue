<template>
  <div class="auction-list-container">
    <header class="list-header">
      <div class="header-content">
        <h1>Leilões Ativos</h1>
        <p class="subtitle">Encontre as melhores oportunidades e dê o seu lance agora mesmo.</p>
      </div>
      <router-link to="/auctions/create" class="btn-create">
        <span class="plus-icon">+</span>
        Novo Leilão
      </router-link>
    </header>

    <div v-if="isLoading" class="state-container">
      <div class="loader-large"></div>
      <p>Sincronizando com o martelo...</p>
    </div>

    <div v-else-if="error" class="state-container error-state">
      <div class="error-icon">!</div>
      <h2>Ops! Algo deu errado</h2>
      <p>{{ error }}</p>
      <button @click="retryFetch" class="btn-retry">Tentar Novamente</button>
    </div>

    <div v-else-if="auctions.length > 0" class="auctions-grid">
      <div 
        v-for="auction in auctions" 
        :key="auction.auctionId" 
        class="auction-card"
        @click="goToDetails(auction.auctionId)"
      >
        <div class="card-image-wrapper">
          <img 
            :src="auction.images?.[0] || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800'" 
            :alt="auction.title" 
            class="auction-image"
          />
          <div class="status-badge" :class="`status-${auction.status.toLowerCase()}`">
            {{ auction.status }}
          </div>
        </div>

        <div class="card-content">
          <h3>{{ auction.title }}</h3>
          
          <div class="price-info">
            <div class="price-block">
              <span class="label">Preço Atual</span>
              <span class="value">R$ {{ auction.startingPrice.toLocaleString('pt-BR') }}</span>
            </div>
            <div class="price-block">
              <span class="label">Incremento</span>
              <span class="value increment">R$ {{ auction.minimumIncrement.toLocaleString('pt-BR') }}</span>
            </div>
          </div>

          <div class="card-footer">
            <button class="btn-details">Dar um Lance</button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="state-container empty-state">
      <div class="empty-icon">📭</div>
      <h2>Nenhum leilão por aqui</h2>
      <p>Parece que o martelo está descansando hoje.</p>
      <router-link to="/auctions/create" class="btn-create-outline">Criar Primeiro Leilão</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuctionStore } from '../stores/auction.store';
import { useRoute, useRouter } from 'vue-router';

const auctionStore = useAuctionStore();
const { auctions, isLoading, error } = storeToRefs(auctionStore);
const route = useRoute();
const router = useRouter();

function fetchAuctionsData() {
  auctionStore.fetchAuctions();
}

function retryFetch() {
  fetchAuctionsData();
}

function goToDetails(id: string) {
  router.push(`/auctions/${id}`);
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
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap');

.auction-list-container {
  min-height: 100vh;
  padding: 3rem 2rem;
  background: radial-gradient(circle at top right, #1e293b 0%, #0f172a 100%);
  font-family: 'Outfit', sans-serif;
  color: #fff;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  max-width: 1200px;
  margin: 0 auto 3rem;
  gap: 2rem;
}

h1 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
}

.subtitle {
  color: #94a3b8;
  font-size: 1.2rem;
}

.btn-create {
  background: linear-gradient(135deg, #38bdf8 0%, #0284c7 100%);
  color: white;
  text-decoration: none;
  padding: 1rem 1.8rem;
  border-radius: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  transition: all 0.3s ease;
  box-shadow: 0 10px 15px -3px rgba(2, 132, 199, 0.3);
  white-space: nowrap;
}

.btn-create:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 25px -5px rgba(2, 132, 199, 0.4);
}

.auctions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.auction-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.auction-card:hover {
  transform: translateY(-10px) scale(1.02);
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(56, 189, 248, 0.3);
  box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.6);
}

.card-image-wrapper {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.auction-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.auction-card:hover .auction-image {
  transform: scale(1.1);
}

.status-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  backdrop-filter: blur(4px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.status-active { background: rgba(34, 197, 94, 0.9); color: white; box-shadow: 0 0 15px rgba(34, 197, 94, 0.4); }
.status-scheduled { background: rgba(59, 130, 246, 0.9); color: white; }
.status-finished { background: rgba(239, 68, 68, 0.9); color: white; }
.status-cancelled { background: rgba(100, 116, 139, 0.9); color: white; }

.card-content {
  padding: 1.5rem;
}

h3 {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 1.2rem;
  color: #f8fafc;
  line-height: 1.2;
}

.price-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
}

.price-block {
  display: flex;
  flex-direction: column;
}

.price-block .label {
  font-size: 0.75rem;
  color: #64748b;
  text-transform: uppercase;
  font-weight: 600;
  margin-bottom: 0.2rem;
}

.price-block .value {
  font-size: 1.1rem;
  font-weight: 700;
  color: #38bdf8;
}

.price-block .increment {
  color: #94a3b8;
}

.btn-details {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  padding: 0.8rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.auction-card:hover .btn-details {
  background: #fff;
  color: #0f172a;
}

.state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem 2rem;
  text-align: center;
}

.loader-large {
  width: 48px;
  height: 48px;
  border: 5px solid rgba(56, 189, 248, 0.2);
  border-radius: 50%;
  border-top-color: #38bdf8;
  animation: spin 1s linear infinite;
  margin-bottom: 1.5rem;
}

.btn-retry, .btn-create-outline {
  margin-top: 1.5rem;
  padding: 0.8rem 2rem;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-retry {
  background: #38bdf8;
  border: none;
  color: #0f172a;
}

.btn-create-outline {
  background: transparent;
  border: 1px solid #38bdf8;
  color: #38bdf8;
  text-decoration: none;
}

.btn-create-outline:hover {
  background: #38bdf8;
  color: #0f172a;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .list-header {
    flex-direction: column;
    align-items: flex-start;
    padding: 0 1rem;
  }
  h1 { font-size: 2.2rem; }
  .btn-create { width: 100%; justify-content: center; }
}
</style>
