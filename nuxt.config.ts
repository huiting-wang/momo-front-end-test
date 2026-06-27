// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'momo購物網（仿站練習）',
      htmlAttrs: { lang: 'zh-Hant' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
  },

  /**
   * Rendering 策略（詳見 docs/ARCHITECTURE.md 第 3 節）
   * - 高 SEO 價值 / 首屏速度重要的頁面 -> SSR
   * - 高即時性、高個人化、低 SEO 價值的頁面 -> CSR-only
   */
  routeRules: {
    '/': { ssr: true },
    '/search': { ssr: true },
    '/goods/**': { ssr: true },
    '/discover': { ssr: false },
    '/live': { ssr: false },
    '/cart': { ssr: false },
  },

  typescript: {
    strict: true,
  },
})
