import Joi from "@hapi/joi"
import BadInputError from "../errors/badInput"

const bodySchema = Joi.array().items(
  Joi.object({
    start: Joi.number().required(),
    end: Joi.number().required()
  })
)

type AvailabilityPutBody = { start: number; end: number }[]

export default function availabilityPutValidator(
  body: any
): AvailabilityPutBody {
  const { value, errors, error } = bodySchema.validate(body)

  if (error) {
    throw new BadInputError(error)
  }

  if (errors) {
    throw new BadInputError(errors)
  }

  return value
}
