<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <header class="sticky top-0 z-50 bg-slate-900/70 backdrop-blur-xl border-b border-white/[0.08] py-3">
    <div class="max-w-7xl mx-auto px-8 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-sky-700 flex items-center justify-center font-extrabold text-white text-lg shadow-[0_4px_12px_rgba(56,189,248,0.4)]">
          G
        </div>
        <span class="font-bold text-lg tracking-widest text-slate-50">
          THDev <span class="text-sky-400">AUCTIONS</span>
        </span>
      </div>

      <nav class="flex items-center gap-10">
        <RouterLink to="/" class="nav-link">Home</RouterLink>
        <RouterLink to="/auctions/" class="nav-link">Explorar</RouterLink>
        <RouterLink to="/auctions/create" class="nav-link px-4 py-2 rounded-xl bg-sky-400/10 text-sky-400 border border-sky-400/20 hover:bg-sky-400 hover:text-slate-900 transition-all duration-200 hover:-translate-y-px">
          Criar Leilão
        </RouterLink>
      </nav>

      <div class="w-10 h-10 rounded-full border-2 border-white/10 overflow-hidden cursor-pointer transition-transform hover:scale-110 hover:border-sky-400">
        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Tiago" alt="User" class="w-full h-full object-cover" />
      </div>
    </div>
  </header>
</template>

<style scoped>
.nav-link {
  color: #94a3b8;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  transition: color 0.3s ease;
}
.nav-link:hover,
.nav-link.router-link-active {
  color: #fff;
}
</style>
