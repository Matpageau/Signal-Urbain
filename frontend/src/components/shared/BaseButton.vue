<script setup lang="ts">

const emit = defineEmits<{
  (e: 'click'): void
}>()
</script>

<template>
  <button class="w-fit px-15 py-2 rounded-full cursor-pointer transition-colors" @click="emit('click')">
    <slot></slot>
  </button>
</template>