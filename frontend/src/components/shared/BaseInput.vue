<script setup lang="ts">
import type { InputTypeHTMLAttribute } from 'vue'

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
      :class="['border border-neutral-200 px-2 rounded-lg w-full', props.modelValue ? 'pt-5 pb-1' : 'py-3']"
      :type="props.type ?? 'text'" 
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <span v-if="placeholder" 
      :class="['absolute left-2 top-1/2 -translate-y-1/2 text-neutral-400 transition-all pointer-events-none',
        props.modelValue ? 'text-xs -translate-y-5' : ''
      ]"
    >
      {{ props.placeholder }}
    </span>
  </div>
</template>