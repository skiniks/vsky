import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import UnoCSS from 'unocss/vite'

export default defineConfig({
  build: {
    emptyOutDir: true,
    minify: true,
    cssMinify: true,
    chunkSizeWarningLimit: 1600,
  },

  plugins: [
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'pinia',
      ],
      dts: './@types/auto-imports.d.ts',
      dirs: ['./src/utils', './src/stores'],
    }),

    Components({
      dts: './@types/components.d.ts',
      dirs: ['./src/components'],
    }),

    Vue(),

    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'safari-pinned-tab.svg'],
      manifest: {
        name: 'vsky',
        short_name: 'vsky',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),

    UnoCSS(),
  ],
})
