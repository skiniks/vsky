import { defineConfig, presetTypography, presetUno, transformerDirectives } from 'unocss'
import { presetDaisy } from 'unocss-preset-daisy'

export default defineConfig({
  presets: [presetDaisy(), presetTypography(), presetUno()],

  transformers: [transformerDirectives()],
})
