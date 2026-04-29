<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps<{
  endTime?: string | Date;
  size?: 'sm' | 'lg'; // Adicionando controle de tamanho
}>();

const emit = defineEmits(['end']);

const timeLeft = ref(0);
let timerInterval: any = null;

const isEndingSoon = computed(() => {
  return timeLeft.value > 0 && timeLeft.value < 60;
});

const countdownText = computed(() => {
  if (timeLeft.value <= 0) return "Encerrado";
  
  const hours = Math.floor(timeLeft.value / 3600);
  const minutes = Math.floor((timeLeft.value % 3600) / 60);
  const seconds = timeLeft.value % 60;
  
  if (props.size === 'sm') {
    return `${hours}h ${minutes}m ${seconds}s`;
  }
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

function updateTimer() {
  if (!props.endTime) return;
  const end = new Date(props.endTime).getTime();
  const now = new Date().getTime();
  const diff = Math.max(0, Math.floor((end - now) / 1000));

  if (diff === 0 && timeLeft.value > 0) {
    emit('end');
  }

  timeLeft.value = diff;
}

watch(() => props.endTime, () => {
  updateTimer();
}, { immediate: true });

onMounted(() => {
  updateTimer();
  timerInterval = setInterval(updateTimer, 1000);
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});
</script>

<template>
  <div 
    :class="[
      'bg-white/5 backdrop-blur-xl border-2 rounded-[28px] transition-all duration-300 flex flex-col items-center justify-center',
      size === 'sm' ? 'p-3 rounded-2xl border-white/5' : 'p-8 rounded-[28px]',
      isEndingSoon 
        ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)] animate-pulse' 
        : size === 'sm' ? 'border-transparent' : 'border-sky-400/20'
    ]"
  >
    <span 
      v-if="size !== 'sm'"
      class="text-slate-500 uppercase text-[10px] font-black tracking-widest mb-1"
    >
      Tempo Restante
    </span>
    <div 
      class="font-black tabular-nums bg-clip-text text-transparent bg-gradient-to-b"
      :class="[
        size === 'sm' ? 'text-lg' : 'text-6xl',
        isEndingSoon ? 'from-red-300 to-red-600' : 'from-white to-slate-400'
      ]"
    >
      {{ countdownText }}
    </div>
  </div>
</template>
