import { createI18n } from 'vue-i18n'

const messages = {
  fr: {
    
  },
  en: {
    
  }
}

const i18n = createI18n({
  legacy: false,
  locale: 'fr',
  fallbackLocale: 'en',
  messages,
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
