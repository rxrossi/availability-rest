import { Model } from "objection"
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

  static get relationMappings(): any {
    const Customer = require("../customer/model").default
    const Professional = require("../professional/model").default

    return {
      customer: {
        relation: Model.BelongsToOneRelation,
        modelClass: Customer,
        join: {
          from: "bookings.customer_id",
          to: "customers.id"
        }
      },
      professional: {
        relation: Model.BelongsToOneRelation,
        modelClass: Professional,
        join: {
          from: "bookings.professional_id",
          to: "professionals.id"
        }
      }
    }
  }
}
