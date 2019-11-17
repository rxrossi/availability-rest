import { Model } from "objection"
import Professional from "../professional/model"
import BaseModel from "../baseModel"

export default class Availability extends BaseModel {
  static tableName = "availabilities"

  professional!: Professional
  professionalId!: number

  start!: number
  end!: number

  static get relationMappings(): any {
    const Professional = require("../professional/model").default

    return {
      professional: {
        relation: Model.BelongsToOneRelation,
        modelClass: Professional,
        join: {
          from: "availabilities.professional_id",
          to: "professionals.id"
        }
      }
    }
  }
}
