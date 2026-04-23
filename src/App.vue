<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-wrapper">
    <header class="navbar-glass">
      <div class="nav-container">
        <div class="logo-area">
          <div class="logo-icon">G</div>
          <span class="logo-text">ANTIGRAVITY <span class="logo-highlight">AUCTIONS</span></span>
        </div>
        
        <nav class="nav-links">
          <RouterLink to="/" class="nav-item">Home</RouterLink>
          <RouterLink to="/auctions/" class="nav-item">Explorar</RouterLink>
          <RouterLink to="/auctions/create" class="nav-item btn-nav">Criar Leilão</RouterLink>
        </nav>

        <div class="user-actions">
          <div class="user-avatar">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Tiago" alt="User" />
          </div>
        </div>
      </div>
    </header>

    <main class="main-content">
      <RouterView v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>

    <footer class="app-footer">
      <p>&copy; 2026 Antigravity Auction Platform. Elevando o padrão dos lances.</p>
    </footer>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap');

:root {
  --primary: #38bdf8;
  --primary-dark: #0284c7;
  --bg-dark: #0f172a;
  --card-bg: rgba(255, 255, 255, 0.03);
  --glass-border: rgba(255, 255, 255, 0.08);
}

body {
  margin: 0;
  padding: 0;
  background-color: var(--bg-dark);
  color: #fff;
  font-family: 'Outfit', sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* Scrollbar Styles */
::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-track {
  background: #0f172a;
}
::-webkit-scrollbar-thumb {
  background: #1e293b;
  border-radius: 5px;
}
::-webkit-scrollbar-thumb:hover {
  background: #334155;
}
</style>

<style scoped>
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar-glass {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--glass-border);
  padding: 0.8rem 0;
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.logo-icon {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  color: white;
  font-size: 1.2rem;
  box-shadow: 0 4px 12px rgba(56, 189, 248, 0.4);
}

.logo-text {
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: 0.05em;
  color: #f8fafc;
}

.logo-highlight {
  color: var(--primary);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2.5rem;
}

.nav-item {
  color: #94a3b8;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.nav-item:hover, .nav-item.router-link-active {
  color: #fff;
}

.btn-nav {
  background: rgba(56, 189, 248, 0.1);
  color: var(--primary);
  padding: 0.6rem 1.2rem;
  border-radius: 10px;
  border: 1px solid rgba(56, 189, 248, 0.2);
}

.btn-nav:hover {
  background: var(--primary);
  color: #0f172a;
  transform: translateY(-1px);
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid var(--glass-border);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
}

.user-avatar:hover {
  transform: scale(1.1);
  border-color: var(--primary);
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.main-content {
  flex-grow: 1;
}

.app-footer {
  padding: 2rem;
  text-align: center;
  color: #475569;
  font-size: 0.9rem;
  border-top: 1px solid var(--glass-border);
}

/* Transitions */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
}
</style>
