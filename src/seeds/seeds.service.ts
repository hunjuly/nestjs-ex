import { Injectable } from '@nestjs/common'
import { Expect, updateIntersection } from 'src/common'
import { CreateSeedDto, SeedDto, UpdateSeedDto } from './dto'
import { SeedsRepository } from './seeds.repository'

@Injectable()
export class SeedsService {
    constructor(private seedsRepository: SeedsRepository) {}

    async create(createSeedDto: CreateSeedDto): Promise<SeedDto> {
        const seed = await this.seedsRepository.create(createSeedDto)

        return new SeedDto(seed)
    }

    async findAll() {
        const seeds = await this.seedsRepository.findAll()

        return seeds.map((seed) => new SeedDto(seed))
    }

    async findById(id: string) {
        const seed = await this.seedsRepository.findById(id)

        Expect.found(seed, `Seed with ID ${id} not found`)

        return new SeedDto(seed)
    }

    async update(id: string, updateSeedDto: UpdateSeedDto) {
        const seed = await this.seedsRepository.findById(id)

        Expect.found(seed, `Seed with ID ${id} not found`)

        const updatedSeed = updateIntersection(seed, updateSeedDto)

        const savedSeed = await this.seedsRepository.save(updatedSeed)

        return new SeedDto(savedSeed)
    }

    async remove(id: string) {
        const seed = await this.seedsRepository.findById(id)

        Expect.found(seed, `Seed with ID ${id} not found`)

        await this.seedsRepository.remove(seed)
    }
}
