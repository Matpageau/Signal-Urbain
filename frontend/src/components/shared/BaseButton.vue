<script setup lang="ts">

const props = defineProps<{
  disable?: boolean
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()
</script>

<template>
  <button 
    :disabled="props.disable"
    class="text-sm w-fit py-2 rounded-full cursor-pointer transition-colors shadow select-none disabled:cursor-default"
    @click="emit('click')"
  >
    <slot></slot>
  </button>
</template>