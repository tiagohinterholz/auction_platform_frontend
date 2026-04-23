<template>
  <div class="home-container">
    <div class="hero-section">
      <div class="hero-content">
        <div class="badge">Leilões em Tempo Real</div>
        <h1>Sinta a Adrenalina de Cada <span class="gradient-text">Lance.</span></h1>
        <p>A plataforma de leilões mais rápida, segura e transparente do mercado. Lotes exclusivos e lances instantâneos com tecnologia de ponta.</p>
        
        <div class="hero-actions">
          <router-link to="/auctions" class="btn-primary-large">Explorar Leilões</router-link>
          <router-link to="/auctions/create" class="btn-secondary-large">Venda um Lote</router-link>
        </div>

        <div class="stats-row">
          <div class="stat-item">
            <span class="stat-value">+1.2k</span>
            <span class="stat-label">Leilões Realizados</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">R$ 4.5M</span>
            <span class="stat-label">Em Lances Totais</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">99.9%</span>
            <span class="stat-label">Uptime do Martelo</span>
          </div>
        </div>
      </div>

      <div class="hero-visual">
        <div class="blob-gradient"></div>
        <div class="visual-card glass">
          <div class="card-header">
            <span class="dot red"></span>
            <span class="live-text">AO VIVO</span>
          </div>
          <div class="card-body">
            <div class="dummy-image"></div>
            <div class="dummy-text-row short"></div>
            <div class="dummy-text-row long"></div>
          </div>
          <div class="card-footer">
            <div class="dummy-btn"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.home-container {
  min-height: 80vh;
  display: flex;
  align-items: center;
  padding: 0 2rem;
  overflow: hidden;
}

.hero-section {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 4rem;
}

.hero-content {
  max-width: 600px;
}

.badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: rgba(56, 189, 248, 0.1);
  color: #38bdf8;
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.85rem;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(56, 189, 248, 0.2);
}

h1 {
  font-size: 4.5rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  letter-spacing: -0.03em;
}

.gradient-text {
  background: linear-gradient(135deg, #38bdf8 0%, #818cf8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

p {
  font-size: 1.25rem;
  color: #94a3b8;
  line-height: 1.6;
  margin-bottom: 2.5rem;
}

.hero-actions {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 4rem;
}

.btn-primary-large {
  background: linear-gradient(135deg, #38bdf8 0%, #0284c7 100%);
  color: white;
  text-decoration: none;
  padding: 1.2rem 2.5rem;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 700;
  transition: all 0.3s ease;
  box-shadow: 0 20px 40px -10px rgba(2, 132, 199, 0.5);
}

.btn-primary-large:hover {
  transform: translateY(-3px);
  filter: brightness(1.1);
  box-shadow: 0 30px 60px -12px rgba(2, 132, 199, 0.6);
}

.btn-secondary-large {
  background: rgba(255, 255, 255, 0.05);
  color: white;
  text-decoration: none;
  padding: 1.2rem 2.5rem;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 700;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.btn-secondary-large:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.stats-row {
  display: flex;
  gap: 3rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 800;
  color: #fff;
}

.stat-label {
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 600;
}

/* Hero Visual */
.hero-visual {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.blob-gradient {
  position: absolute;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.2) 0%, rgba(129, 140, 248, 0) 70%);
  filter: blur(60px);
  animation: float-blob 10s infinite alternate;
}

@keyframes float-blob {
  from { transform: translate(0, 0); }
  to { transform: translate(30px, 50px); }
}

.visual-card {
  width: 320px;
  height: 400px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 32px;
  padding: 1.5rem;
  box-shadow: 0 50px 100px -20px rgba(0,0,0,0.5);
  animation: float-card 6s ease-in-out infinite;
}

@keyframes float-card {
  0%, 100% { transform: translateY(0) rotate(-2deg); }
  50% { transform: translateY(-20px) rotate(2deg); }
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.red { 
  background: #ef4444; 
  box-shadow: 0 0 10px #ef4444;
  animation: blink 1s infinite;
}

@keyframes blink {
  50% { opacity: 0.3; }
}

.live-text {
  font-size: 0.75rem;
  font-weight: 800;
  color: #f8fafc;
}

.dummy-image {
  width: 100%;
  height: 160px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  margin-bottom: 1.5rem;
}

.dummy-text-row {
  height: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 5px;
  margin-bottom: 0.8rem;
}

.dummy-text-row.short { width: 60%; }
.dummy-text-row.long { width: 90%; }

.dummy-btn {
  height: 40px;
  background: rgba(56, 189, 248, 0.2);
  border-radius: 12px;
  margin-top: 1.5rem;
}

@media (max-width: 1024px) {
  .hero-section {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 2rem;
  }
  .hero-content { max-width: 100%; }
  .hero-actions { justify-content: center; }
  .stats-row { justify-content: center; }
  h1 { font-size: 3rem; }
  .hero-visual { display: none; }
}
</style>
