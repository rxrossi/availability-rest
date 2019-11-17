import Customer from "../customer/model"
import BaseModel from "../baseModel"

export default class Booking extends BaseModel {
  static tableName = "bookings"

  readonly id!: number
  dateTime!: Date

  customer!: Customer
  customerId!: number

  professional!: Customer
  professionalId!: number
}
