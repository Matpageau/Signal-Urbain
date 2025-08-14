import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import middleware from 'i18next-http-middleware';
import path from 'path';

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
	backend: {
	  loadPath: path.join(
		process.cwd(), 'src', 'locales', '{{lng}}', '{{ns}}.json'),  // Path to translation files
	},
	detection: {
	  order: ['header', 'querystring', 'cookie'],           			// Priority: URL query string first, then cookies
	  caches: ['cookie'],                                   			// Cache detected language in cookies
	},
	fallbackLng: 'fr',                                      			// Default language when no language is detected
	preload: ['fr', 'en'],                                  			// Preload these languages at startup
  });

const i18nMiddleware = middleware.handle(i18next);
export default i18nMiddleware;