"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18next_1 = __importDefault(require("i18next"));
const i18next_fs_backend_1 = __importDefault(require("i18next-fs-backend"));
const i18next_http_middleware_1 = __importDefault(require("i18next-http-middleware"));
const path_1 = __importDefault(require("path"));
i18next_1.default
    .use(i18next_fs_backend_1.default)
    .use(i18next_http_middleware_1.default.LanguageDetector)
    .init({
    backend: {
        loadPath: path_1.default.join(process.cwd(), 'src', 'locales', '{{lng}}', '{{ns}}.json'), // Path to translation files
    },
    detection: {
        order: ['header', 'querystring', 'cookie'], // Priority: URL query string first, then cookies
        caches: ['cookie'], // Cache detected language in cookies
    },
    fallbackLng: 'fr', // Default language when no language is detected
    preload: ['fr', 'en'], // Preload these languages at startup
});
const i18nMiddleware = i18next_http_middleware_1.default.handle(i18next_1.default);
exports.default = i18nMiddleware;
