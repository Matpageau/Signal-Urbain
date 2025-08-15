<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import BaseInput from '@/components/shared/BaseInput.vue';
import groupedIcons from '@/assets/img/groupedIcons.png'
import BaseButton from '@/components/shared/BaseButton.vue';

const { t } = useI18n()

const errorsMsgs = ref<string[]>(['INVLID_USERNAME', 'INVLID_PASSWORD'])

const username = ref<string>('')
const password = ref<string>('')

watch([username, password], () => {
  errorsMsgs.value = []
})
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
        <BaseButton class="mt-4 bg-(--blue) hover:bg-(--blue_hover) text-white">
          <p>{{ t('SIGNIN') }}</p>
        </BaseButton>
      </div>
    </div>
  </div>
</template>