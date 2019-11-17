import decryptToken from "./decryptToken"
import Professional from "../professional/model"
import { Request, Response, NextFunction } from "express"

export default async function getRequestUserMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  if (req.headers.authorization) {
    const authorizationParts = req.headers.authorization.split(" ")
    const authenticationType = authorizationParts[0]

    if (authenticationType === "Bearer") {
      const { userId } = await decryptToken(authorizationParts[1])
      req.user = await Professional.query().findById(userId)
    }
  }

  next()
}
