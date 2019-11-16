import Professional from "./model"
import { Request, Response } from "express"

export default class ProfessionalsController {
  async getAll(_req: Request, res: Response) {
    const professionals = await Professional.query()

    res.json(professionals)
  }
}
