import { Request } from "express"
import Customer from "../customer/model"
import UnauthorizedError from "../errors/unauthorized"

export default function customerOrThrow(req: Request): Customer {
  if (!(req.user instanceof Customer)) {
    throw new UnauthorizedError("Unauthorized access")
  }

  return req.user
}
