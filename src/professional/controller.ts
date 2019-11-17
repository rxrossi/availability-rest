import { QueryBuilder } from "objection"
import Professional from "./model"
import { Request, Response } from "express"

export default class ProfessionalsController {
  async getAll(req: Request, res: Response) {
    const query = Professional.query().select(
      "professionals.id as id",
      "professionals.name as name"
    )

    if (req.query.availableFrom || req.query.availableTo) {
      filterByAvailability(
        query,
        req.query.availableFrom,
        req.query.availableTo
      )
    }

    res.json(await query)
  }
}

function filterByAvailability(
  query: QueryBuilder<Professional>,
  fromISODate?: string,
  toISODate?: string
) {
  if (!fromISODate || !toISODate) {
    return
  }

  query.joinRelation("availabilities")

  if (fromISODate) {
    const from = fromDateStringToWeeksFromWeekStart(fromISODate)
    query.andWhere("availabilities.start", ">=", from)
  }

  if (toISODate) {
    const to = fromDateStringToWeeksFromWeekStart(toISODate)
    query.andWhere("availabilities.end", "<=", to)
  }
}

function fromDateStringToWeeksFromWeekStart(isoDate: string): number {
  const date = new Date(isoDate)

  const MINUTES_IN_A_HOUR = 60
  const HOURS_IN_A_DAY = 24
  const MINUTES_IN_A_DAY = HOURS_IN_A_DAY * MINUTES_IN_A_HOUR

  const daysInMinutes = date.getDay() * MINUTES_IN_A_DAY
  const hoursInMinutes = date.getHours() * MINUTES_IN_A_HOUR

  return daysInMinutes + hoursInMinutes + date.getMinutes()
}
