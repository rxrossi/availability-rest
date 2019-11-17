import { RequestHandler, Request, Response, NextFunction } from "express"

export default function routeErrorHandlerWrapper(handler: RequestHandler) {
  return (req: Request, res: Response, next: NextFunction) => {
    return handler(req, res, next).catch(next)
  }
}
