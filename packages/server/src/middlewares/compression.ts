import { Request, Response, NextFunction } from 'express'
import compression from 'compression'

export default function isProdCompressionMiddleware(isProd: boolean) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (isProd) {
      compression()(req, res, next)
    } else {
      next()
    }
  }
}
