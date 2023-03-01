import { Injectable } from '@nestjs/common'
import { Expect, updateIntersection } from 'src/common'
import { CreateSeedDto, UpdateSeedDto } from './dto'
import { SeedsRepository } from './seeds.repository'

@Injectable()
export class SeedsService {
    constructor(private seedsRepository: SeedsRepository) {}

    async create(createSeedDto: CreateSeedDto) {
        const seed = await this.seedsRepository.create(createSeedDto)

        return seed
    }

    async findAll() {
        const seeds = await this.seedsRepository.findAll()

        return seeds
    }

    async findById(id: string) {
        const seed = await this.seedsRepository.findById(id)

        Expect.found(seed, `Seed with ID ${id} not found`)

        return seed
    }

    async update(id: string, updateSeedDto: UpdateSeedDto) {
        const seed = await this.seedsRepository.findById(id)

        Expect.found(seed, `Seed with ID ${id} not found`)

        const updatedSeed = updateIntersection(seed, updateSeedDto)

        const savedSeed = await this.seedsRepository.save(updatedSeed)

        return savedSeed
    }

    async remove(id: string) {
        const seed = await this.seedsRepository.findById(id)

        Expect.found(seed, `Seed with ID ${id} not found`)

        await this.seedsRepository.remove(seed)
    }
}
