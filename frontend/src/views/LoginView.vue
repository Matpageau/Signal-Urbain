<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import axios, { AxiosError } from "axios"

const userStore = useUserStore()
import BaseInput from '@/components/shared/BaseInput.vue';
import groupedIcons from '@/assets/img/groupedIcons.png'
import BaseButton from '@/components/shared/BaseButton.vue';
import { useUserStore } from '@/stores/userStore';
import router from '@/router';

const { t } = useI18n()

const errorsMsgs = ref<string[]>(['INVLID_USERNAME', 'INVLID_PASSWORD'])

const username = ref<string>('')
const password = ref<string>('')

watch([username, password], () => {
  errorsMsgs.value = []
})

const handleLogin = async () => {
  try {
    const payload = {email: username.value, password: password.value}
    const res = await axios.post("http://localhost:3000/api/user/login", payload)

    if(res.data) {
      userStore.currentUser = res.data
      router.push('/')
    }
  } catch (error) {
    const err = error as AxiosError<{ code?: [string] }>
    errorsMsgs.value = err.response?.data?.code ?? ["UNKNOWN_ERROR"]
    console.error(err)
  }
}
</script>

<template>
  <div class="flex justify-center items-center w-full h-full">
    <img class="mr-40" :src="groupedIcons" alt="grouped pins">
    <div class="flex gap-15 flex-col items-center w-1/4">
      <div class="text-center">
        <h1 class="text-4xl font-medium">{{ t('LOGIN') }}</h1>
        <h1 class="font-junge text-4xl">Signal Urbain</h1>
      </div>
      <form action="" class="flex flex-col gap-3 w-full">
        <BaseInput 
          v-model="username"
          type="email"
          :placeholder="t('EMAILORUSERNAME')"
          :error="errorsMsgs.includes('INVALID_EMAIL') ? t('errors.INVALID_EMAIL') : ''"
        />
        <BaseInput 
          v-model="password"
          type="password"
          :placeholder="t('PASSWORD')"
          :error="errorsMsgs.includes('INVLID_PASSWORD') ? t('errors.INVALID_PASSWORD') : ''"
        />
      </form>
      <div class="flex flex-col items-center">
        <p>{{ t('DONTHAVEACCOUNT') }}<a href="/register">{{ t('SIGNUPNOW') }}</a></p>
        <BaseButton class="mt-4 bg-(--blue) hover:bg-(--blue_hover) text-white" @click="handleLogin">
          <p>{{ t('SIGNIN') }}</p>
        </BaseButton>
      </div>
    </div>
  </div>
</template>