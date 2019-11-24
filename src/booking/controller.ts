import { Request, Response } from "express"
import { DateTime } from "luxon"
import customerOrThrow from "../authorization/customerOrThrow"
import Booking from "./model"
import OneLinerError from "../errors/oneLinerError"

export default class BookingController {
  async get(req: Request, res: Response) {
    const customer = customerOrThrow(req)

    const bookings = await Booking.query()
      .select("id", "date_time")
      .where({ customer_id: customer.id })
      .eager("professional")
      .modifyEager("professional", builder => {
        builder.select("id", "name")
      })

    res.json(bookings)
  }

  async post(req: Request, res: Response) {
    const customer = customerOrThrow(req)

    await throwIfOverlapsAnotherBooking(
      req.body.dateTime,
      req.body.professionalId
    )

    const booking = await Booking.query().insert({
      professionalId: req.body.professionalId,
      customerId: customer.id,
      dateTime: req.body.dateTime
    })

    res.json({
      id: booking.id,
      professionalId: booking.professionalId,
      dateTime: booking.dateTime
    })
  }
}

async function throwIfOverlapsAnotherBooking(
  ISOdateTime: string,
  professionalId: number
) {
  const overlappingBookings = await Booking.query()
    .where(
      "date_time",
      ">=",
      DateTime.fromISO(ISOdateTime)
        .minus({ minutes: 30 })
        .toJSDate()
    )
    .andWhere(
      "date_time",
      "<=",
      DateTime.fromISO(ISOdateTime)
        .plus({ minutes: 30 })
        .toJSDate()
    )
    .andWhere("professional_id", professionalId)

  if (overlappingBookings.length > 0) {
    throw new OneLinerError(
      `This booking overlaps another booking starting at ${overlappingBookings[0].dateTime}`
    )
  }
}
