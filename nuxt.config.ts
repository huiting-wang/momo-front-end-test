// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@nuxt/eslint'],
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
   */
  routeRules: {
    '/**': {
      headers: {
        // 防止 iframe 點擊挾持攻擊
        'X-Frame-Options': 'DENY',
        // 禁止任何來源的框架嵌入
        'Content-Security-Policy': "frame-ancestors 'none'",
      },
    },
    '/': { ssr: true },
    '/search': { ssr: true },
    '/goods/**': { ssr: true },
  },

  typescript: {
    strict: true,
  },
})
