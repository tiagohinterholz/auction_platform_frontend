<template>
  <main class="min-h-screen flex items-start justify-center bg-slate-950 p-6 pt-16">
    <div class="w-full max-w-lg">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-500">
          Meu Perfil
        </h1>
        <p class="text-slate-400 mt-2">Visualize e edite seus dados</p>
      </div>

      <AppCard v-if="isLoading && !userStore.profile" class="text-center py-10">
        <p class="text-slate-400">Carregando...</p>
      </AppCard>

      <AppCard v-else-if="userStore.profile">
        <form @submit.prevent="handleSubmit" class="grid grid-cols-1 gap-5">
          <AppFormField label="Nome Completo" htmlFor="name" fullWidth>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              minlength="2"
              class="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            />
          </AppFormField>

          <AppFormField label="E-mail" htmlFor="email" fullWidth>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            />
          </AppFormField>

          <AppFormField label="Perfil" htmlFor="role" fullWidth>
            <input
              id="role"
              :value="userStore.profile.role"
              type="text"
              disabled
              class="w-full bg-slate-900/20 border border-white/5 rounded-xl px-4 py-3 text-slate-500 cursor-not-allowed"
            />
          </AppFormField>

          <AppButton type="submit" variant="primary" :loading="isSubmitting" class="w-full justify-center">
            Salvar Alterações
          </AppButton>
        </form>
      </AppCard>

      <AppAlert v-if="successMessage" type="success" :message="successMessage" />
      <AppAlert v-if="userStore.error" type="error" :message="userStore.error" />
    </div>
  </main>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/modules/auth/stores/auth.store";
import { useUserStore } from "../stores/user.store";
import AppCard from "@/components/AppCard.vue";
import AppFormField from "@/components/AppFormField.vue";
import AppButton from "@/components/AppButton.vue";
import AppAlert from "@/components/AppAlert.vue";

const authStore = useAuthStore();
const userStore = useUserStore();
const { isLoading } = storeToRefs(userStore);

const form = reactive({ name: "", email: "" });
const isSubmitting = ref(false);
const successMessage = ref("");

watch(
  () => userStore.profile,
  (profile) => {
    if (profile) {
      form.name = profile.name;
      form.email = profile.email;
    }
  },
);

async function handleSubmit() {
  if (!authStore.userId) return;
  successMessage.value = "";
  isSubmitting.value = true;

  const ok = await userStore.updateProfile(authStore.userId, {
    name: form.name,
    email: form.email,
  });

  if (ok) {
    successMessage.value = "Perfil atualizado com sucesso.";
    // Keep the navbar (which reads authStore.name/email from the JWT decoded
    // at login) in sync without requiring a fresh token.
    authStore.name = form.name;
    authStore.email = form.email;
  }

  isSubmitting.value = false;
}

onMounted(() => {
  if (authStore.userId) {
    userStore.fetchProfile(authStore.userId);
  }
});
</script>
