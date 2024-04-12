import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      description: null,
      phone: null,
      latitude: -13.2274405,
      longitude: -39.5012025
    })

    gymsRepository.create({
      title: 'Near Gym 2',
      description: null,
      phone: null,
      latitude: -13.2271509,
      longitude: -39.5049439
    })

    await gymsRepository.create({
      title: 'Far Gym',
      description: null,
      phone: null,
      latitude: -13.3704719,
      longitude: -39.0864446
    })

    const { gyms } = await sut.execute({
      userLatitude: -13.2274405,
      userLongitude: -39.5012025
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Near Gym' }),
      expect.objectContaining({ title: 'Near Gym 2' })
    ])
  })
})
