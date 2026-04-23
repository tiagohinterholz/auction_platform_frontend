<template>
  <div class="auction-detail-container">
    <div v-if="isLoading" class="state-container">
      <div class="loader-large"></div>
      <p>Buscando detalhes do lote...</p>
    </div>

    <div v-else-if="error" class="state-container error-state">
      <div class="error-icon">!</div>
      <h2>Erro ao carregar leilão</h2>
      <p>{{ error }}</p>
      <button @click="fetchData" class="btn-retry">Tentar Novamente</button>
    </div>

    <div v-else-if="auction" class="detail-grid">
      <!-- Left Column: Media & Description -->
      <div class="media-section">
        <div class="image-card glass">
          <img 
            :src="auction.images?.[0] || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800'" 
            :alt="auction.title" 
            class="main-image"
          />
          <div class="status-badge-floating" :class="`status-${auction.status.toLowerCase()}`">
            {{ auction.status }}
          </div>
        </div>

        <div class="info-card glass">
          <h2>Sobre este lote</h2>
          <p class="description">
            Este é um item exclusivo em leilão. Certifique-se de revisar as regras de incremento 
            mínimo e o tempo restante antes de confirmar seu lance. Lances dados nos últimos 
            30 segundos estenderão o leilão automaticamente (Anti-Sniping).
          </p>
          <div class="auction-meta">
            <div class="meta-item">
              <span class="label">ID do Leilão</span>
              <span class="value">#{{ auction.auctionId.slice(0, 8) }}</span>
            </div>
            <div class="meta-item">
              <span class="label">Incremento Mín.</span>
              <span class="value">R$ {{ auction.minimumIncrement.toLocaleString('pt-BR') }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Bidding & Stats -->
      <div class="bidding-section">
        <!-- Timer Card -->
        <div class="timer-card glass" :class="{ 'timer-urgent': isEndingSoon }">
          <span class="label">Tempo Restante</span>
          <div class="countdown">
            {{ countdownText }}
          </div>
        </div>

        <!-- Bidding Card -->
        <div class="bidding-card glass">
          <div class="current-price-header">
            <span class="label">Lance Atual</span>
            <div class="price-display">
              <span class="currency">R$</span>
              <span class="amount">{{ auction.startingPrice.toLocaleString('pt-BR') }}</span>
            </div>
            <span class="bid-count">12 lances registrados</span>
          </div>

          <form @submit.prevent="handlePlaceBid" class="bid-form">
            <div class="input-group">
              <span class="input-prefix">R$</span>
              <input 
                type="number" 
                v-model.number="bidAmount" 
                :min="minNextBid"
                step="1"
                required
                placeholder="Seu lance..."
              />
            </div>
            <p class="min-bid-hint">Lance mínimo: R$ {{ minNextBid.toLocaleString('pt-BR') }}</p>
            
            <button type="submit" class="btn-bid" :disabled="!isAuctionActive">
              Dar Lance Agora
            </button>
          </form>
        </div>

        <!-- History Card -->
        <div class="history-card glass">
          <h3>Histórico de Lances</h3>
          <div class="history-list">
            <div v-for="i in 5" :key="i" class="history-item">
              <div class="bidder-info">
                <span class="bidder-name">Usuário #{{ 1234 + i }}</span>
                <span class="bid-time">há {{ i * 2 }} minutos</span>
              </div>
              <span class="bid-value">R$ {{ (auction.startingPrice - (i * 500)).toLocaleString('pt-BR') }}</span>
            </div>
          </div>
          <button class="btn-view-all">Ver Histórico Completo</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuctionStore } from '../stores/auction.store';
import { storeToRefs } from 'pinia';
import { AuctionStatus } from '../types';

const route = useRoute();
const auctionStore = useAuctionStore();
const { currentAuction: auction, isLoading, error } = storeToRefs(auctionStore);

const bidAmount = ref(0);
const timeLeft = ref(0);
let timerInterval: any = null;

const fetchData = async () => {
  await auctionStore.fetchAuctionById(route.params.id as string);
  if (auction.value) {
    bidAmount.value = auction.value.startingPrice + auction.value.minimumIncrement;
    updateTimer();
  }
};

const minNextBid = computed(() => {
  if (!auction.value) return 0;
  return auction.value.startingPrice + auction.value.minimumIncrement;
});

const isAuctionActive = computed(() => {
  return auction.value?.status === AuctionStatus.ACTIVE;
});

const isEndingSoon = computed(() => {
  return timeLeft.value > 0 && timeLeft.value < 60; // Less than 1 minute
});

const countdownText = computed(() => {
  if (timeLeft.value <= 0) return "Encerrado";
  
  const hours = Math.floor(timeLeft.value / 3600);
  const minutes = Math.floor((timeLeft.value % 3600) / 60);
  const seconds = timeLeft.value % 60;
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

function updateTimer() {
  if (!auction.value?.endTime) return;
  
  const end = new Date(auction.value.endTime).getTime();
  const now = new Date().getTime();
  timeLeft.value = Math.max(0, Math.floor((end - now) / 1000));
}

async function handlePlaceBid() {
  alert(`Funcionalidade de lance para R$ ${bidAmount.value} será implementada com a BiddingAPI!`);
}

onMounted(() => {
  fetchData();
  timerInterval = setInterval(updateTimer, 1000);
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap');

.auction-detail-container {
  min-height: 100vh;
  padding: 3rem 2rem;
  background: radial-gradient(circle at top right, #1e293b 0%, #0f172a 100%);
  font-family: 'Outfit', sans-serif;
  color: #fff;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 2.5rem;
  max-width: 1300px;
  margin: 0 auto;
}

.glass {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 28px;
  padding: 2rem;
}

/* Media Section */
.image-card {
  position: relative;
  padding: 1rem;
  margin-bottom: 2rem;
  height: 500px;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 20px;
}

.status-badge-floating {
  position: absolute;
  top: 2rem;
  right: 2rem;
  padding: 0.6rem 1.5rem;
  border-radius: 30px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  box-shadow: 0 10px 20px rgba(0,0,0,0.3);
}

.status-active { background: #22c55e; color: #fff; }
.status-scheduled { background: #3b82f6; color: #fff; }

.info-card h2 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #f8fafc;
}

.description {
  color: #94a3b8;
  line-height: 1.7;
  margin-bottom: 2rem;
}

.auction-meta {
  display: flex;
  gap: 3rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1.5rem;
}

.meta-item {
  display: flex;
  flex-direction: column;
}

.meta-item .label {
  color: #64748b;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.meta-item .value {
  color: #e2e8f0;
  font-weight: 700;
  font-size: 1.2rem;
}

/* Bidding Section */
.timer-card {
  text-align: center;
  margin-bottom: 2rem;
  border: 2px solid rgba(56, 189, 248, 0.2);
  transition: all 0.3s ease;
}

.timer-urgent {
  border-color: #ef4444;
  animation: pulse-red 2s infinite;
}

.countdown {
  font-size: 4rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  background: linear-gradient(to bottom, #fff, #94a3b8);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.timer-urgent .countdown {
  background: linear-gradient(to bottom, #fca5a5, #ef4444);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.bidding-card {
  margin-bottom: 2rem;
  background: rgba(255, 255, 255, 0.05);
}

.price-display {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin: 0.5rem 0;
}

.price-display .currency {
  font-size: 1.5rem;
  color: #38bdf8;
  font-weight: 600;
}

.price-display .amount {
  font-size: 3.5rem;
  font-weight: 800;
  color: #fff;
}

.bid-count {
  color: #64748b;
  font-size: 0.9rem;
}

.bid-form {
  margin-top: 2rem;
}

.input-group {
  position: relative;
  margin-bottom: 1rem;
}

.input-prefix {
  position: absolute;
  left: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  font-weight: 700;
}

.input-group input {
  width: 100%;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.2rem 1.2rem 1.2rem 3.5rem;
  border-radius: 16px;
  color: #fff;
  font-size: 1.5rem;
  font-weight: 700;
  box-sizing: border-box;
}

.min-bid-hint {
  color: #64748b;
  font-size: 0.85rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

.btn-bid {
  width: 100%;
  background: linear-gradient(135deg, #38bdf8 0%, #0284c7 100%);
  color: white;
  border: none;
  padding: 1.2rem;
  border-radius: 18px;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 15px 30px -10px rgba(2, 132, 199, 0.5);
}

.btn-bid:hover:not(:disabled) {
  transform: translateY(-3px);
  filter: brightness(1.1);
  box-shadow: 0 20px 40px -10px rgba(2, 132, 199, 0.6);
}

.btn-bid:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  filter: grayscale(1);
}

/* History */
.history-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1.5rem 0;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.bidder-name {
  display: block;
  font-weight: 600;
  color: #e2e8e0;
}

.bid-time {
  font-size: 0.75rem;
  color: #64748b;
}

.bid-value {
  font-weight: 700;
  color: #38bdf8;
}

.btn-view-all {
  width: 100%;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  padding: 0.6rem;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.btn-view-all:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
}

@keyframes pulse-red {
  0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.2); }
  70% { box-shadow: 0 0 0 20px rgba(239, 68, 68, 0); }
  100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 1024px) {
  .detail-grid { grid-template-columns: 1fr; }
  .image-card { height: 400px; }
}
</style>
