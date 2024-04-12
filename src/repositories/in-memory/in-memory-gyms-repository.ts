import { randomUUID } from 'node:crypto'

import { Gym, Prisma } from '@prisma/client'

import { FindManyNearbyParam, GymsRepository } from '../gyms-repository'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = []

  async findById(id: string): Promise<Gym | null> {
    const gym = this.items.find(item => item.id === id)

    return gym ? gym : null
  }

  async findManyNearby(params: FindManyNearbyParam) {
    return this.items.filter(item => {
      const distance = getDistanceBetweenCoordinates(
        {
          latitude: params.latitude,
          longitude: params.longitude
        },
        {
          latitude: item.latitude.toNumber(),
          longitude: item.longitude.toNumber()
        }
      )

      return distance <= 10
    })
  }

  async searchMany(query: string, page: number) {
    return this.items
      .filter(item => item.title.toLowerCase().includes(query.toLowerCase()))
      .slice((page - 1) * 20, page * 20)
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString())
    }

    this.items.push(gym)

    return gym
  }
}
