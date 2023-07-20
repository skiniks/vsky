import { defineConfig, presetAttributify, presetIcons, presetTypography, presetUno, transformerDirectives } from 'unocss'
import { presetDaisy } from 'unocss-preset-daisy'

export default defineConfig({
  rules: [
    ['bg-dark', { background: '#121212' }],
  ],

  presets: [presetDaisy({ themes: false }), presetAttributify(), presetIcons({ scale: 1.2, warn: true }), presetTypography(), presetUno()],

  transformers: [transformerDirectives()],
})
