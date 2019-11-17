import UnauthorizedError from "../errors/unauthorized"
import { ErrorRequestHandler } from "express"
import BadInputError from "./badInput"
import OneLinerError from "./oneLinerError"

const expressErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof UnauthorizedError) {
    res.sendStatus(401)
  }

  if (err instanceof BadInputError) {
    res.status(422)
    res.json(err.inputError)
  }

  if (err instanceof OneLinerError) {
    res.status(422)
    res.json(err.message)
  }
}

export default expressErrorHandler
