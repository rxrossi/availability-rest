import { Model, snakeCaseMappers } from "objection"

export default class BaseModel extends Model {
  createdAt!: string
  updatedAt?: string

  static columnNameMappers = snakeCaseMappers()

  $beforeInsert(): void {
    this.createdAt = new Date().toISOString()
  }

  $beforeUpdate(): void {
    this.updatedAt = new Date().toISOString()
  }
}
