<script setup lang="ts">
defineProps<{
  label: string
  htmlFor: string
  helpText?: string
  fullWidth?: boolean
}>()
</script>

<template>
  <div :class="['flex flex-col gap-1.5', fullWidth ? 'col-span-2' : '']">
    <label :for="htmlFor" class="text-slate-200 font-semibold text-sm ml-0.5">
      {{ label }}
    </label>
    <slot />
    <small v-if="helpText" class="text-slate-500 text-xs mt-0.5">{{ helpText }}</small>
  </div>
</template>
