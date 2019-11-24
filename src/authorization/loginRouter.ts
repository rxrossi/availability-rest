import { Router } from "express"
import { Request, Response } from "express"
import routeErrorHandlerWrapper from "../errors/routeErrorHandlerWrapper"
import Professional from "../professional/model"
import Customer from "../customer/model"
import { UserType } from "./userType"
import createToken from "../authorization/generateToken"

const router = Router()

router.post("/", routeErrorHandlerWrapper(login))

export default router

async function login(req: Request, res: Response) {
  const { email, password } = req.body

  const professional = await Professional.query().findOne({ email })
  if (professional && (await professional.isPasswordCorrect(password))) {
    return res.json(
      createToken({
        email: professional.email,
        userId: professional.id,
        userType: UserType.Professional
      })
    )
  }

  const customer = await Customer.query().findOne({ email })
  if (customer && (await customer.isPasswordCorrect(password))) {
    return res.json(
      createToken({
        email: customer.email,
        userId: customer.id,
        userType: UserType.Customer
      })
    )
  }

  res.json("Invalid credentials")
}
