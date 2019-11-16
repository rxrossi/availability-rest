import { Model } from "objection"

export default class Professional extends Model {
  static tableName = "professionals"

  name!: string
}
