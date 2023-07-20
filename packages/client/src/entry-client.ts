import { createPinia } from 'pinia'
import { createApp } from './main'
import createRouter from './router'
import App from './App.vue'

const pinia = createPinia()
const router = createRouter()
const app = createApp(App)

app.use(pinia).use(router)

router.isReady().then(() => {
  app.mount('#app')
})
