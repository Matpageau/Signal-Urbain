import './assets/base.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import i18n from '@/utils/i18n'

import App from './App.vue'
import router from './router'

function getLangFromCookie(): string | null {
  const match = document.cookie.match(/(?:^|; )lang=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : null
}

const savedLang = getLangFromCookie()
if (savedLang) {
  if(savedLang === "fr" || savedLang === "en") {
    i18n.global.locale.value = savedLang
  }
}

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)

app.mount('#app')
