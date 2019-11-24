import * as objection from "objection"
import { omit, map, compose, identity } from "lodash/fp"
import Professional from "./model"
import { Request, Response } from "express"
import { DateTime } from "luxon"
import Booking from "../booking/model"

export default class ProfessionalsController {
  async getAll(req: Request, res: Response) {
    const { availableFrom, availableTo } = req.query
    const isQueryingForAvailability = Boolean(availableFrom && availableTo)

    const professionalsQuery = Professional.query().select("id", "name")

    if (isQueryingForAvailability) {
      filterByAvailabilityAndAddRelevantBookings(
        professionalsQuery,
        availableFrom,
        availableTo
      )
    }

    const professionals = await professionalsQuery

    res.json(
      compose(
        map(omit(["bookings", "availabilities"])),
        professionals =>
          isQueryingForAvailability
            ? addBookingSlots(availableFrom, availableTo, professionals)
            : identity(professionals)
      )(professionals)
    )
  }
}

function filterByAvailabilityAndAddRelevantBookings(
  query: objection.QueryBuilder<Professional>,
  availableFrom: string,
  availableTo: string
): void {
  const toISOPlus30min = DateTime.fromISO(availableTo)
    .plus({ minute: 30 })
    .toISO()
  const fromISODateMinus30min = DateTime.fromISO(availableFrom)
    .minus({ minute: 30 })
    .toISO()
  const knex = Professional.knex()

  query
    .from(queryBuilder =>
      queryBuilder
        .select(
          "professionals.id",
          "professionals.name",
          knex.raw(
            `
              extract (hours from
                bookings.date_time
                - LAG (bookings.date_time, 1)
                OVER (
                  PARTITION BY bookings.professional_id
                  ORDER BY bookings.date_time ASC
                )
              ) as interval_to_previous_booking
            `
          ),
          knex.raw(
            `
             extract (hours from
               LEAD (bookings.date_time, 1)
               OVER (
                 PARTITION BY bookings.professional_id
                 ORDER BY bookings.date_time ASC
               )
               - bookings.date_time
             ) as interval_to_next_booking
            `
          )
        )
        .from("professionals")
        .join(
          "availabilities",
          "professionals.id",
          "availabilities.professional_id"
        )
        .andWhereBetween("availabilities.start", [
          fromDateStringToWeeksFromWeekStart(availableFrom),
          fromDateStringToWeeksFromWeekStart(availableTo)
        ])
        .orWhereBetween("availabilities.end", [
          fromDateStringToWeeksFromWeekStart(availableFrom),
          fromDateStringToWeeksFromWeekStart(availableTo)
        ])
        .leftJoin("bookings", function(join) {
          join
            .on("professionals.id", "bookings.professional_id")
            .andOn(knex.raw("bookings.date_time  <= ?", toISOPlus30min))
            .andOn(knex.raw("bookings.date_time  >= ?", fromISODateMinus30min))
        })
        .as("professionals_with_booking_intervals")
    )
    .distinct("id")
    .where("interval_to_previous_booking", ">=", 2)
    .orWhere("interval_to_previous_booking", null)
    .orWhere("interval_to_next_booking", ">=", 2)
    .orWhere("interval_to_next_booking", null)
    .eager("[bookings, availabilities]")
    .modifyEager("bookings", builder =>
      builder
        .andWhere("bookings.date_time", ">=", fromISODateMinus30min)
        .andWhere("bookings.date_time", "<=", toISOPlus30min)
        .select("date_time")
    )
    .modifyEager("availabilities", builder =>
      builder
        .andWhereBetween("availabilities.start", [
          fromDateStringToWeeksFromWeekStart(availableFrom),
          fromDateStringToWeeksFromWeekStart(availableTo)
        ])
        .orWhereBetween("availabilities.end", [
          fromDateStringToWeeksFromWeekStart(availableFrom),
          fromDateStringToWeeksFromWeekStart(availableTo)
        ])
        .select("start", "end")
    )
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

function addBookingSlots(
  fromISODate: string,
  toISODate: string,
  professionals: Professional[]
): {
  id: number
  name: string
  bookings?: Partial<Booking>[]
  bookingSlots: DateTime[]
}[] {
  const hoursDiff =
    DateTime.fromISO(toISODate)
      .diff(DateTime.fromISO(fromISODate), "hours")
      .toObject().hours || 0

  const possibleSlotsGivenQueryDateRange = hoursDiff * 2 + 1

  return professionals.map(professional => ({
    ...professional,
    bookingSlots: Array.from(
      Array(possibleSlotsGivenQueryDateRange),
      (_, index) => DateTime.fromISO(fromISODate).plus({ minutes: 30 * index })
    )
      .filter(
        dateTime =>
          professional.bookings
            .map(booking => {
              return Math.abs(
                DateTime.fromJSDate(booking.dateTime)
                  .diff(dateTime, "minutes")
                  .toObject().minutes!
              )
            })
            .filter(interval => interval < 60).length === 0
      )
      .filter(dateTime => {
        return professional.availabilities.find(availability => {
          return (
            availability.start <=
              fromDateStringToWeeksFromWeekStart(dateTime.toISO()) &&
            availability.end >=
              fromDateStringToWeeksFromWeekStart(
                dateTime.plus({ hours: 1 }).toISO()
              )
          )
        })
      })
  }))
}
