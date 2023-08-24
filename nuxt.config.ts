// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['@unocss/reset/tailwind.css', '@/assets/main.css'],
  modules: [
    '@unocss/nuxt',
    '@pinia/nuxt',
  ],
  plugins: [
    { src: '~/plugins/bsky-agent.ts', mode: 'client' },
  ],
  srcDir: 'src',
})
