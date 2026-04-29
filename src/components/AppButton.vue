<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary'
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
}>()
</script>

<template>
  <button
    :type="type ?? 'button'"
    :disabled="loading"
    :class="[
      'inline-flex items-center gap-3 px-10 py-4 rounded-xl text-lg font-bold cursor-pointer transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed',
      variant === 'secondary'
        ? 'bg-transparent text-slate-400 border border-white/10 hover:bg-white/5 hover:text-white'
        : 'bg-gradient-to-br from-sky-400 to-sky-700 text-white border-none shadow-[0_10px_15px_-3px_rgba(2,132,199,0.3)] hover:-translate-y-0.5 hover:shadow-[0_20px_25px_-5px_rgba(2,132,199,0.4)] hover:brightness-110 active:translate-y-0'
    ]"
  >
    <span
      v-if="loading"
      class="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin"
    />
    <slot />
  </button>
</template>
