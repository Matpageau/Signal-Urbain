<script setup lang="ts">
import { onMounted } from 'vue';
import { useUserStore } from './stores/userStore';


const userStore = useUserStore()
  onMounted(async () => {
    await userStore.fetchUser()
  })
</script>

<template>
  <main class="h-screen w-screen">
    <RouterView />
  </main>
</template>
