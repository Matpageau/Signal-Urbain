import { createI18n } from 'vue-i18n'
import fr from '@/locales/fr'
import en from '@/locales/en'
import es from '@/locales/es'

const i18n = createI18n({
  legacy: false,
  locale: 'fr',
  fallbackLocale: 'en',
  messages: {fr, en, es},
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
    },
    es: {
      currency: {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }
    }
  }
})

export default i18n
