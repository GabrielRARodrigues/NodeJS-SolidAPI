import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createGymBodySchema = z.object({
    title: z.string(),
    phone: z.string().nullable(),
    description: z.string().nullable(),
    latitude: z.number().refine(value => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine(value => {
      return Math.abs(value) <= 180
    })
  })

  const { title, description, phone, latitude, longitude } =
    createGymBodySchema.parse(request.body)

  const { useCase } = makeCreateGymUseCase()

  await useCase.execute({
    title,
    description,
    phone,
    latitude,
    longitude
  })

  return reply.status(201).send()
}
