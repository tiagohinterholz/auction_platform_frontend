<script setup lang="ts">
defineProps<{
  type?: 'error' | 'success'
  message: string
}>()
</script>

<template>
  <Transition name="fade">
    <div
      v-if="message"
      :class="[
        'mt-8 flex items-center gap-3 px-6 py-4 rounded-xl border text-sm font-medium',
        type === 'success'
          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
          : 'bg-red-500/10 border-red-500/20 text-red-300 animate-shake'
      ]"
    >
      <span class="text-base">{{ type === 'success' ? '✓' : '!' }}</span>
      <span>{{ message }}</span>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes shake {

  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}

.animate-shake {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}
</style>
