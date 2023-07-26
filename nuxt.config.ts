// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'vSky',
    },
  },

  css: ['@unocss/reset/tailwind.css', '@/assets/main.css'],

  modules: [
    '@unocss/nuxt',
    '@nuxt/image',
  ],

  nitro: {
    future: {
      nativeSWR: true,
    },
  },

  srcDir: 'src',
})
