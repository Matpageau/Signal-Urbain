<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import BaseInput from '@/components/shared/BaseInput.vue';
import groupedPins from '@/assets/img/groupedPins.png'
import BaseButton from '@/components/shared/BaseButton.vue';

const { t } = useI18n()

const errorsMsgs = ref<string[]>(['INVLID_USERNAME', 'INVLID_PASSWORD'])

const username = ref<string>('')
const email = ref<string>('')
const password = ref<string>('')
const confirmPassword = ref<string>('')

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
          :error="errorsMsgs.includes('INVLID_USERNAME') ? t('errors.INVALID_USERNAME') : ''"
        />
        <BaseInput 
          v-model="email"
          type="email"
          :placeholder="t('EMAIL')"
          :error="errorsMsgs.includes('INVALID_EMAIL') ? t('errors.INVALID_EMAIL') : ''"
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
        <BaseButton class="mt-4 bg-(--blue) hover:bg-(--blue_hover) text-white px-15">
          <p>{{ t('SIGNUP') }}</p>
        </BaseButton>
      </div>
    </div>
    <img class="ml-40" :src="groupedPins" alt="grouped pins">
  </div>
</template>