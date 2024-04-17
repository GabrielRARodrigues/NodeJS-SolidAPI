import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { makeValidateCheckInUseCase } from '@/use-cases/factories/make-validate-check-in-use-case'
import { LateCheckInValidationError } from '@/use-cases/errors/late-check-in-validation-error'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const validateCheckInParamsSchema = z.object({
    checkInId: z.string().uuid()
  })

  const { checkInId } = validateCheckInParamsSchema.parse(request.params)

  try {
    const { useCase } = makeValidateCheckInUseCase()

    await useCase.execute({
      checkInId
    })
  } catch (err) {
    if (
      err instanceof LateCheckInValidationError ||
      err instanceof ResourceNotFoundError
    ) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }

  return reply.status(204).send()
}
