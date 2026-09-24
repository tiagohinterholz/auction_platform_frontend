<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import type { LoginDto } from '../../domain/login.dto';
import AppCard from '@/components/AppCard.vue';
import AppFormField from '@/components/AppFormField.vue';
import AppButton from '@/components/AppButton.vue';
import AppAlert from '@/components/AppAlert.vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const form = reactive<LoginDto>({
  email: '',
  password: '',
});

const isLoading = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
  errorMessage.value = '';
  isLoading.value = true;
  
  try {
    await authStore.login(form);
    const redirectPath = (route.query.redirect as string) || '/auctions/create';
    router.push(redirectPath);
  } catch (error: any) {
    if (Array.isArray(error.response?.data?.message)) {
      errorMessage.value = error.response.data.message[0];
    } else {
      errorMessage.value = error.response?.data?.message || 'Falha ao realizar login. Verifique suas credenciais.';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <main class="min-h-screen flex items-center justify-center bg-slate-950 p-6">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500">
          Bem-vindo de volta
        </h1>
        <p class="text-slate-400 mt-2">Acesse sua conta para dar lances</p>
      </div>

      <AppCard>
        <form @submit.prevent="handleLogin" class="flex flex-col gap-5">
          <AppFormField label="E-mail" htmlFor="email">
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              placeholder="seu@email.com"
              class="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            />
          </AppFormField>

          <AppFormField label="Senha" htmlFor="password">
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              placeholder="••••••••"
              class="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            />
          </AppFormField>

          <div class="mt-4 flex flex-col gap-4">
            <AppButton type="submit" variant="primary" :loading="isLoading" class="w-full justify-center">
              Entrar
            </AppButton>
          </div>
        </form>
      </AppCard>

      <AppAlert v-if="errorMessage" type="error" :message="errorMessage" />

      <p class="text-center mt-8 text-slate-400">
        Não possui uma conta?
        <router-link to="/register" class="text-sky-400 hover:text-sky-300 font-semibold transition-colors">
          Cadastre-se
        </router-link>
      </p>
    </div>
  </main>
</template>
