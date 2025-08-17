<script setup lang="ts">
import PlusIcon from '../icons/PlusIcon.vue';

const emit = defineEmits<{
  (e: 'click'): void
}>()
</script>

<template>
  <div class="absolute justify-center items-center flex top-0 left-0 w-full h-full z-100 bg-white/20">
    <div class="relative bg-white w-1/2 h-1/2 rounded-lg p-2">
      <PlusIcon class="absolute top-2 right-2 rotate-45 cursor-pointer" :onclick="() => emit('click')"/>
      <div>
        <div>
          
        </div>
      </div>
    </div>
  </div>
</template>