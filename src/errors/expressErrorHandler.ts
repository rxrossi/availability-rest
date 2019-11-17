import UnauthorizedError from "../errors/unauthorized"
import { ErrorRequestHandler } from "express"

const expressErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof UnauthorizedError) {
    res.sendStatus(401)
  }
  res.sendStatus(500)
}

export default expressErrorHandler
