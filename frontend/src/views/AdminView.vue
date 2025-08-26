<script setup lang="ts">
import { useUserStore } from '@/stores/userStore';
import { useI18n } from 'vue-i18n';
import userPlaceholder from '@/assets/img/Avatar placeholder.png'
import BaseInput from '@/components/shared/BaseInput.vue';
import { ref } from 'vue';
import BaseButton from '@/components/shared/BaseButton.vue';

const { t } = useI18n()
const userStore = useUserStore()


const email = ref<string>("")
const password = ref<string>("")
const city = ref<string>("")

const handleNewCityAdmin = async () => {
  try {
    
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div class="flex w-full h-full overflow-hidden">
    <div class="w-full flex p-5">
      <div class="flex flex-col w-2/3 h-full">
        <a href="/app" class="text-xl">{{ t('BACKONAPP') }}</a>
        <div class="m-5 flex flex-col flex-1 min-h-0">
          <div class="flex items-center">
            <img 
              :src="userStore.currentUser?.avatar_url || userPlaceholder"
              alt="avatar"
              class="w-[75px] h-[75px] rounded-full"
              @error="($event) => ($event.target as HTMLImageElement).src = userPlaceholder"
            >
            <h1 class="ml-3 text-3xl font-bold">{{ userStore.currentUser?.username }}</h1>
          </div>
          <div class="flex flex-col mt-10 gap-3">
            <BaseInput 
              type="email"
              placeholder="Email"
              v-model="email"
            />
            <BaseInput 
              type="text"
              :placeholder="t('PASSWORD')"
              v-model="password"
            />
            <BaseInput 
              type="text"
              :placeholder="t('CITY')"
              v-model="city"
            />
          </div>
          <BaseButton
            class="bg-(--blue) px-2 text-white mt-5"
            @click="handleNewCityAdmin"
          >
            Créer un nouveau city admin
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>