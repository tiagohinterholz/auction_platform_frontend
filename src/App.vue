<script setup lang="ts">
import { RouterView } from 'vue-router'
import TheNavBar from './components/TheNavBar.vue'
import TheFooter from './components/TheFooter.vue';
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <TheNavBar />
    <main class="flex-grow">
      <RouterView v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>
    <TheFooter />
  </div>
</template>

<style>
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.page-fade-enter-from { opacity: 0; transform: translateY(10px); }
.page-fade-leave-to   { opacity: 0; transform: translateY(-10px); }
</style>