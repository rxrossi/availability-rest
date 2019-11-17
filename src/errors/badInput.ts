import { ValidationError } from "@hapi/joi"

export default class BadInputError extends Error {
  inputError: ValidationError

  constructor(errors: ValidationError) {
    const message = "Invalid input"
    super(message)
    this.message = message
    this.name = "BAD_INPUT_ERROR"
    this.inputError = errors
  }
}
