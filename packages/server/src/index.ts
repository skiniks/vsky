import express from 'express'
import { createServer as createViteServer } from 'vite'
import isProdCompressionMiddleware from './middlewares/compression'
import renderMiddleware from './middlewares/renderer'

async function createServer(isProd = process.env.NODE_ENV === 'production') {
  const app = express()
  const vite = await createViteServer({
    server: { middlewareMode: true },
  })

  app.use(vite.middlewares)
  app.use(isProdCompressionMiddleware(isProd))
  app.use('*', renderMiddleware(vite, isProd))

  const port = process.env.PORT || 4200

  app.listen(Number(port), '0.0.0.0', () => console.log(`✨ vSky is listening @ http://localhost:${port}`))
}

createServer()
