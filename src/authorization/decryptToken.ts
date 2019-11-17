import jwt from "jsonwebtoken"
import { UserType } from "./userType"

interface DecryptedTokenPayload {
  email: string
  userId: string | number
  userType: UserType
  iat: number
  exp: number
}

export default async function decryptToken(
  token: string
): Promise<DecryptedTokenPayload> {
  const tokenSecret = process.env.JWT_TOKEN_SECRET

  if (!tokenSecret) {
    throw new Error("JWT env var is not defined")
  }

  try {
    return jwt.verify(token, tokenSecret) as Promise<DecryptedTokenPayload>
  } catch (ex) {
    const error = ex.message ? ex.message : "Your token is invalid"

    throw new Error(error)
  }
}
