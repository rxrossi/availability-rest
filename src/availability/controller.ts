import Availability from "./model"
import { Request, Response } from "express"

export default class AvailabilityController {
  async getAll(_req: Request, res: Response) {
    const availabilities = await Availability.query().select("start", "end")

    res.json(availabilities)
  }
}
