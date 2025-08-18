import { createI18n } from 'vue-i18n'
import fr from '@/locales/fr'
import en from '@/locales/en'

const i18n = createI18n({
  legacy: false,
  locale: 'fr',
  fallbackLocale: 'en',
  messages: {fr, en},
  numberFormats: {
    en: {
      currency: {
        style: "currency",
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }
    },
    fr: {
      currency: {
        style: 'currency',
        currency: "CAD",
        currencyDisplay: 'narrowSymbol',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }
    }
  }
})

export default i18n
