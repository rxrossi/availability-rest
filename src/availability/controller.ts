import Availability from "./model"
import { Request, Response } from "express"
import professionalOrThrow from "../authorization/professionalOrThrow"

export default class AvailabilityController {
  async getAll(req: Request, res: Response) {
    const professional = professionalOrThrow(req)

    const availabilities = await Availability.query()
      .select("start", "end")
      .where("professional_id", professional.id)

    res.json(availabilities)
  }
}
