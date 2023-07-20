import fs from 'node:fs/promises'
import path from 'node:path'
import { Request, Response, NextFunction } from 'express'
import { ViteDevServer } from 'vite'

function resolve(p: string) {
  return path.resolve(__dirname, p)
}
const productionBuildPath = path.join(__dirname, './dist/server/entry-server.mjs')
const devBuildPath = path.join(__dirname, 'index.ts')

export default function renderMiddleware(vite: ViteDevServer, isProd: boolean) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { originalUrl: url } = req

    try {
      let template = await fs.readFile(isProd ? resolve('dist/client/index.html') : resolve('index.html'), 'utf-8')
      template = await vite.transformIndexHtml(url, template)

      const { render } = await vite.ssrLoadModule(isProd ? productionBuildPath : devBuildPath)
      const appHtml = await render(url)
      const html = template.replace('<!--app-html-->', appHtml)

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    }
    catch (error: any) {
      !isProd && vite.ssrFixStacktrace(error)
      console.log(error.stack)
      next(error)
    }
  }
}
