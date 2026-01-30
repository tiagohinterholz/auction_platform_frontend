<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/auctions/">Leilões</RouterLink>
      <RouterLink to="/auctions/create">Criar Leilão</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
  background-color: #f8f8f8;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

nav {
  width: 100%;
  font-size: 1rem;
  text-align: center;
  margin-top: 1rem;
}

nav a.router-link-exact-active {
  color: #007bff;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
  color: #333;
  text-decoration: none;
}

nav a:first-of-type {
  border: 0;
}
</style>
