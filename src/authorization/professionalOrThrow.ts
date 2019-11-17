import { Request } from "express"
import Professional from "../professional/model"

export default function professionalOrThrow(req: Request): Professional {
  if (!(req.user instanceof Professional)) {
    throw Error("Unauthorized access")
  }

  return req.user
}
