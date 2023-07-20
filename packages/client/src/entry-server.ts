import { renderToString } from 'vue/server-renderer'
import { createPinia } from 'pinia'
import { createApp } from './main'
import createRouter from './router'
import App from './App.vue'

interface InitData {
  [key: string]: any
}

export async function render({ initData }: { initData: InitData }) {
  const pinia = createPinia()
  const router = createRouter()
  const app = createApp(App, initData)

  app.use(pinia).use(router)

  const appHtml = await renderToString(app)

  return { appHtml }
}
