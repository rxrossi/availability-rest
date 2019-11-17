import { Model } from "objection"
import bcrypt from "bcryptjs"
import Availability from "../availability/model"
import BaseModel from "../baseModel"
import Booking from "../booking/model"

export default class Professional extends BaseModel {
  static tableName = "professionals"

  readonly id!: number
  name!: string
  email!: string
  password!: string

  availabilities!: Availability[]
  bookings!: Booking[]

  async $beforeInsert(): Promise<void> {
    super.$beforeInsert()
    if (this.password) {
      this.password = await encryptedPassword(this.password)
    }
  }

  async $beforeUpdate(): Promise<void> {
    super.$beforeUpdate()
    if (this.password) {
      this.password = await encryptedPassword(this.password)
    }
  }

  isPasswordCorrect(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password)
  }

  static get relationMappings(): any {
    const Availability = require("../availability/model").default
    const Booking = require("../booking/model").default

    return {
      availabilities: {
        relation: Model.HasManyRelation,
        modelClass: Availability,
        join: {
          from: "availabilities.professional_id",
          to: "professionals.id"
        }
      },
      bookings: {
        relation: Model.HasManyRelation,
        modelClass: Booking,
        join: {
          from: "bookings.professional_id",
          to: "professionals.id"
        }
      }
    }
  }
}

async function encryptedPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}
