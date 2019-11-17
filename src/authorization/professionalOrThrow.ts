import { Request } from "express"
import Professional from "../professional/model"
import UnauthorizedError from "../errors/unauthorized"

export default function professionalOrThrow(req: Request): Professional {
  if (!(req.user instanceof Professional)) {
    throw new UnauthorizedError("Unauthorized access")
  }

  return req.user
}
