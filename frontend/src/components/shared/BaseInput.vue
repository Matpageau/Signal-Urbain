<script setup lang="ts">
import { type InputTypeHTMLAttribute } from 'vue'

const props = defineProps<{
  type: InputTypeHTMLAttribute,
  placeholder?: string
  modelValue: string | number
  error?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

</script>

<template>
  <div class="relative">
    <input
      :class="['border border-neutral-200 px-2 rounded-lg w-full py-3',
        { 'pt-5 pb-1' : props.modelValue && props.placeholder },
        { 'border-red-500' : props.error }
      ]"
      :type="props.type ?? 'text'" 
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <span v-if="placeholder"
      :class="[
        'absolute left-2 text-neutral-400 transition-all pointer-events-none',
        props.modelValue ? 'text-xs top-1' : 'top-3'
      ]"
    >
      {{ props.placeholder }}
    </span>
    <span
      v-if="error"
      class="text-red-600 text-sm mt-1 min-h-[1.25rem]" 
      aria-live="polite"
    >
      {{ props.error || '\u00A0' }}
    </span>
  </div>
</template>