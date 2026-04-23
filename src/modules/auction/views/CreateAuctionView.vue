<template>
  <div class="create-auction-container">
    <div class="glass-card">
      <h1>Criar Novo Leilão</h1>
      <p class="subtitle">Preencha os detalhes para iniciar um novo leilão na plataforma.</p>

      <form @submit.prevent="handleSubmit" class="auction-form">
        <div class="form-grid">
          <div class="form-group full-width">
            <label for="title">Título do Leilão</label>
            <input 
              type="text" 
              id="title" 
              v-model="title" 
              placeholder="Ex: iPhone 15 Pro Max - Lote 01"
              required 
            />
          </div>

          <div class="form-group">
            <label for="startingPrice">Preço Inicial (R$)</label>
            <div class="input-with-icon">
              <span class="currency-prefix">R$</span>
              <input 
                type="number" 
                id="startingPrice" 
                v-model.number="startingPrice" 
                required 
                min="0" 
              />
            </div>
          </div>

          <div class="form-group">
            <label for="minimumIncrement">Incremento Mínimo (R$)</label>
            <div class="input-with-icon">
              <span class="currency-prefix">R$</span>
              <input 
                type="number" 
                id="minimumIncrement" 
                v-model.number="minimumIncrement" 
                required 
                min="1" 
              />
            </div>
          </div>

          <div class="form-group full-width">
            <label for="images">URL da Imagem do Produto</label>
            <input 
              type="text" 
              id="images" 
              v-model="imageUrl" 
              placeholder="https://sua-imagem.com/produto.png" 
            />
            <small class="help-text">Insira um link direto para a imagem principal do lote.</small>
          </div>

          <div class="form-group">
            <label for="startTime">Data de Início</label>
            <input 
              type="datetime-local" 
              id="startTime" 
              v-model="startTime" 
              required 
            />
          </div>

          <div class="form-group">
            <label for="endTime">Data de Término</label>
            <input 
              type="datetime-local" 
              id="endTime" 
              v-model="endTime" 
              required 
            />
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-secondary" @click="router.back()">Cancelar</button>
          <button type="submit" class="btn-primary" :disabled="isLoading">
            <span v-if="isLoading" class="loader"></span>
            {{ isLoading ? 'Processando...' : 'Publicar Leilão' }}
          </button>
        </div>

        <Transition name="fade">
          <div v-if="error" class="error-alert">
            <i class="icon-error">!</i>
            <span>{{ error }}</span>
          </div>
        </Transition>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuctionStore } from '../stores/auction.store';
import type { CreateAuctionPayload } from '../types';

const router = useRouter();
const auctionStore = useAuctionStore();

const title = ref('');
const startingPrice = ref(0);
const minimumIncrement = ref(1);
const imageUrl = ref('');

// Helper to get ISO date for datetime-local input
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

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap');

.create-auction-container {
  min-height: 100vh;
  padding: 3rem 1rem;
  background: radial-gradient(circle at top right, #1e293b 0%, #0f172a 100%);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  font-family: 'Outfit', sans-serif;
}

.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 3rem;
  border-radius: 24px;
  width: 100%;
  max-width: 680px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

h1 {
  color: #fff;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
}

.subtitle {
  color: #94a3b8;
  font-size: 1.1rem;
  margin-bottom: 2.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.full-width {
  grid-column: span 2;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

label {
  color: #e2e8f0;
  font-weight: 600;
  font-size: 0.95rem;
  margin-left: 0.2rem;
}

input {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 0.9rem 1.2rem;
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

input:focus {
  outline: none;
  border-color: #38bdf8;
  background: rgba(255, 255, 255, 0.07);
  box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.15);
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.currency-prefix {
  position: absolute;
  left: 1.2rem;
  color: #64748b;
  font-weight: 600;
  pointer-events: none;
}

.input-with-icon input {
  padding-left: 3.2rem;
  width: 100%;
}

.help-text {
  color: #64748b;
  font-size: 0.8rem;
  margin-top: 0.2rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-primary {
  background: linear-gradient(135deg, #38bdf8 0%, #0284c7 100%);
  color: white;
  border: none;
  padding: 1rem 2.5rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 15px -3px rgba(2, 132, 199, 0.3);
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 20px 25px -5px rgba(2, 132, 199, 0.4);
  filter: brightness(1.1);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-secondary {
  background: transparent;
  color: #94a3b8;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
}

.error-alert {
  margin-top: 2rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #fca5a5;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}

@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}

.loader {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  .full-width {
    grid-column: span 1;
  }
  .glass-card {
    padding: 2rem 1.5rem;
  }
  .form-actions {
    flex-direction: column-reverse;
  }
}
</style>
