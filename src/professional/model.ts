import { Model } from "objection"
import Availability from "../availability/model"

export default class Professional extends Model {
  static tableName = "professionals"

  name!: string

  availabilities!: Availability[]

  static get relationMappings(): any {
    const Availability = require("../availability/model").default

    return {
      availabilities: {
        relation: Model.HasManyRelation,
        modelClass: Availability,
        join: {
          from: "availabilities.professional_id",
          to: "professionals.id"
        }
      }
    }
  }
}
