<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import BaseInput from '@/components/shared/BaseInput.vue';
import groupedPins from '@/assets/img/groupedPins.png'
import BaseButton from '@/components/shared/BaseButton.vue';
import type { AxiosError } from 'axios';
import type { ApiError } from '@/types/ApiError';
import axios from 'axios';
import router from '@/router';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore()
const { t } = useI18n()

const errorsMsgs = ref<string[]>([])

const username = ref<string>('')
const email = ref<string>('')
const password = ref<string>('')
const confirmPassword = ref<string>('')

const handleRegister = async () => {
  try {
    const payload = {email: email.value, password: password.value, username: username.value}
    const res = await axios.post("http://localhost:3000/api/user/register", payload, { withCredentials: true })

    if(res.data) {      
      const resLog = await axios.post("http://localhost:3000/api/user/login", {
        email: payload.email,
        password: payload.password
      }, { withCredentials: true })

      if(resLog.data) {
        userStore.fetchUser()
        router.push('/')
      }
    }
  } catch (error) {
    const err = error as AxiosError<ApiError[]>

    if (err.response?.data) {
      errorsMsgs.value = err.response.data.map(e => e.errorKey);
    } else {
      errorsMsgs.value = ["Unknown error occurred"];
    }
  }
}

watch([username, email, password, confirmPassword], () => {
  errorsMsgs.value = []
})
</script>

<template>
  <div class="flex justify-center items-center w-full h-full">
    <div class="flex gap-15 flex-col items-center w-1/4">
      <div class="text-center">
        <h1 class="text-4xl font-medium">{{ t('REGISTER') }}</h1>
        <h1 class="font-junge text-4xl">Signal Urbain</h1>
      </div>
      <form action="" class="flex flex-col gap-3 w-full">
        <BaseInput 
          v-model="username"
          type="text"
          :placeholder="t('USERNAME')"
          :error="errorsMsgs.includes('USERNAME_ALREADY_EXIST') ? t('errors.INVALID_USERNAME') : ''"
        />
        <BaseInput 
          v-model="email"
          type="email"
          :placeholder="t('EMAIL')"
          :error="errorsMsgs.includes('EMAIL_ALREADY_EXIST') ? t('errors.INVALID_EMAIL') : ''"
        />
        <BaseInput 
          v-model="password"
          type="password"
          :placeholder="t('PASSWORD')"
          :error="errorsMsgs.includes('INVLID_PASSWORD') ? t('errors.INVALID_PASSWORD') : ''"
        />
        <BaseInput 
          v-model="confirmPassword"
          type="password"
          :placeholder="t('CONFIRMPASSWORD')"
          :error="errorsMsgs.includes('INVLID_PASSWORD') ? t('errors.INVALID_PASSWORD') : ''"
        />
      </form>
      <div class="flex flex-col items-center">
        <p>{{ t('ALREADYHAVEACCOUNT') }}<a href="/login">{{ t('CONNECTNOW') }}</a></p>
        <BaseButton class="mt-4 bg-(--blue) hover:bg-(--blue_hover) text-white px-15" @click="handleRegister">
          <p>{{ t('SIGNUP') }}</p>
        </BaseButton>
      </div>
    </div>
    <img class="ml-40" :src="groupedPins" alt="grouped pins">
  </div>
</template>