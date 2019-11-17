import { Request, Response } from "express"
import customerOrThrow from "../authorization/customerOrThrow"

export default class BookingController {
  async post(req: Request, _res: Response) {
    customerOrThrow(req)
  }
}
