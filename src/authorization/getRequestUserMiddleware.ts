import decryptToken from "./decryptToken"
import Professional from "../professional/model"
import { Request, Response, NextFunction } from "express"
import { UserType } from "./userType"
import Customer from "../customer/model"

export default async function getRequestUserMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  if (req.headers.authorization) {
    const authorizationParts = req.headers.authorization.split(" ")
    const authenticationType = authorizationParts[0]

    if (authenticationType === "Bearer") {
      const { userId, userType } = await decryptToken(authorizationParts[1])

      if (userType === UserType.Professional) {
        req.user = await Professional.query().findById(userId)
      } else if (userType === UserType.Customer) {
        req.user = await Customer.query().findById(userId)
      }
    }
  }

  next()
}
