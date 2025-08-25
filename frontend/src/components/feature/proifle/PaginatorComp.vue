<script setup lang="ts">
import ChevronIcon from '@/components/icons/ChevronIcon.vue';
import { computed } from 'vue';

const page = defineModel<number>({ default: 0 })

const props = defineProps<{
  totalItems: number
}>()

const totalPages = computed(() => Math.ceil(props.totalItems / 9))

const isLastPage = computed(() => page.value >= totalPages.value - 1)

</script>

<template>
  <div class="flex gap-1">
    <button 
      :disabled="page === 0" 
      class="border rounded cursor-pointer disabled:opacity-50 disabled:cursor-auto"
      @click="() => page --"
    >
      <ChevronIcon class="rotate-180"/>
    </button>
    <button
      :disabled="isLastPage" 
      class="border rounded cursor-pointer disabled:opacity-50 disabled:cursor-auto"
      @click="() => page ++"
    >
      <ChevronIcon/>
    </button>
  </div>
</template>