import UnauthorizedError from "../errors/unauthorized"
import { ErrorRequestHandler } from "express"
import BadInputError from "./badInput"

const expressErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof UnauthorizedError) {
    res.sendStatus(401)
  }

  if (err instanceof BadInputError) {
    res.status(422)
    res.json(err.inputError)
  }
}

export default expressErrorHandler
