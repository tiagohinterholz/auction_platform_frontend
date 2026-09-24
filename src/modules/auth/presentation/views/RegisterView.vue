<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import type { RegisterDto } from '../../domain/register.dto';
import AppCard from '@/components/AppCard.vue';
import AppFormField from '@/components/AppFormField.vue';
import AppButton from '@/components/AppButton.vue';
import AppAlert from '@/components/AppAlert.vue';

const router = useRouter();
const authStore = useAuthStore();

const form = reactive<RegisterDto>({
  name: '',
  email: '',
  cpf: '',
  password: '',
});

const isLoading = ref(false);
const errorMessage = ref('');

const handleRegister = async () => {
  errorMessage.value = '';
  isLoading.value = true;
  
  try {
    await authStore.register(form);
    router.push('/');
  } catch (error: any) {
    if (Array.isArray(error.response?.data?.message)) {
      errorMessage.value = error.response.data.message[0];
    } else {
      errorMessage.value = error.response?.data?.message || 'Falha ao criar conta. Verifique os dados informados.';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <main class="min-h-screen flex items-center justify-center bg-slate-950 p-6">
    <div class="w-full max-w-lg">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-500">
          Crie sua Conta
        </h1>
        <p class="text-slate-400 mt-2">Junte-se aos maiores leilões</p>
      </div>

      <AppCard>
        <form @submit.prevent="handleRegister" class="grid grid-cols-2 gap-5">
          <AppFormField label="Nome Completo" htmlFor="name" fullWidth>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              placeholder="João da Silva"
              class="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </AppFormField>

          <AppFormField label="E-mail" htmlFor="email">
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              placeholder="seu@email.com"
              class="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </AppFormField>

          <AppFormField label="CPF" htmlFor="cpf">
            <input
              id="cpf"
              v-model="form.cpf"
              type="text"
              required
              placeholder="Apenas números"
              maxlength="11"
              class="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </AppFormField>

          <AppFormField label="Senha" htmlFor="password" fullWidth helpText="Mínimo de 6 caracteres">
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              placeholder="••••••••"
              minlength="6"
              class="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </AppFormField>

          <div class="col-span-2 mt-4 flex flex-col gap-4">
            <AppButton type="submit" variant="primary" :loading="isLoading" class="w-full justify-center !from-emerald-500 !to-sky-600 hover:shadow-[0_20px_25px_-5px_rgba(16,185,129,0.4)]">
              Criar Conta
            </AppButton>
          </div>
        </form>
      </AppCard>

      <AppAlert v-if="errorMessage" type="error" :message="errorMessage" />

      <p class="text-center mt-8 text-slate-400">
        Já tem uma conta?
        <router-link to="/login" class="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
          Faça Login
        </router-link>
      </p>
    </div>
  </main>
</template>
