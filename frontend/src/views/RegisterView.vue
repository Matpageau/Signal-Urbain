<script setup lang="ts">
import BaseInput from '@/components/shared/BaseInput.vue';
import { ref } from 'vue';

const username = ref<string>('')
const email = ref<string>('')

</script>

<template>
  <div class="flex justify-center items-center w-full h-full">
    <div class="flex flex-col items-center w-1/4">
      <div class="text-center">
        <h1 class="text-4xl font-medium">Inscription</h1>
        <h1 class="font-junge text-4xl">Signal Urbain</h1>
      </div>
      <form action="" class="flex flex-col gap-3 mt-10 w-full">
        <BaseInput 
          v-model="username"
          type="text"
        />
        <BaseInput 
          v-model="email"
          type="email"
          placeholder="Email adress"
        />
      </form>
    </div>
  </div>
</template>