// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['@unocss/reset/tailwind.css', '@/assets/main.css'],
  modules: [
    '@unocss/nuxt',
    '@pinia/nuxt',
  ],
  plugins: [
    '~/plugins/bsky-agent.ts',
  ],
  srcDir: 'src',
})
