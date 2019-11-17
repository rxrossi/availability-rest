import bcrypt from "bcryptjs"
import BaseModel from "../baseModel"

export default class Customer extends BaseModel {
  static tableName = "customers"

  readonly id!: number
  name!: string
  email!: string
  password!: string

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
}

async function encryptedPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}
