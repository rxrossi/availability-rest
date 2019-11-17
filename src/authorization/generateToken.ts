import jwt from "jsonwebtoken"
import { UserType } from "./userType"

export default function createToken(payload: {
  email: string
  userId: number | number
  userType: UserType
}): string {
  const tokenSecret = process.env.JWT_TOKEN_SECRET

  if (!tokenSecret) {
    throw new Error("JWT env var is not defined")
  }

  return jwt.sign(payload, tokenSecret, {
    expiresIn: "3 weeks"
  })
}
