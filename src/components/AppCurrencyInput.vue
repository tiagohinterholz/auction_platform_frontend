<script setup lang="ts">
defineProps<{
  id: string
  modelValue: number
  min?: number
  required?: boolean
}>()

defineEmits<{
  'update:modelValue': [value: number]
}>()
</script>

<template>
  <div class="relative flex items-center">
    <span class="absolute left-5 text-slate-500 font-semibold pointer-events-none">R$</span>
    <input
      :id="id"
      type="number"
      :value="modelValue"
      :min="min"
      :required="required"
      class="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-12 pr-5 py-3.5 text-white text-base transition-all duration-300 focus:outline-none focus:border-sky-400 focus:bg-white/[0.07] focus:shadow-[0_0_0_4px_rgba(56,189,248,0.15)]"
      @input="$emit('update:modelValue', Number(($event.target as HTMLInputElement).value))"
    />
  </div>
</template>
