import { Injectable } from '@nestjs/common'
import { plainToClass, plainToInstance } from 'class-transformer'
import { Expect, updateIntersection } from 'src/common'
import { SeedDto } from './dto'
import { CreateSeedDto } from './dto/create-seed.dto'
import { UpdateSeedDto } from './dto/update-seed.dto'
import { SeedsRepository } from './seeds.repository'

@Injectable()
export class SeedsService {
    constructor(private repository: SeedsRepository) {}

    async create(createSeedDto: CreateSeedDto): Promise<SeedDto> {
        const newSeed = this.repository.create(createSeedDto)
        const seed = await this.repository.save(newSeed)

        return plainToClass(SeedDto, seed)
    }

    async findAll(): Promise<SeedDto[]> {
        const seeds = await this.repository.find()

        return seeds.map((seed) => plainToClass(SeedDto, seed))
    }

    async findById(id: string): Promise<SeedDto> {
        const seed = await this.repository.findOneBy({ id })

        Expect.found(seed, `Seed with ID ${id} not found`)

        return plainToClass(SeedDto, seed)
    }

    async update(id: string, updateSeedDto: UpdateSeedDto): Promise<SeedDto> {
        const seed = await this.repository.findOneBy({ id })

        Expect.found(seed, `Seed with ID ${id} not found`)

        const updatedSeed = updateIntersection(seed, updateSeedDto)

        const savedSeed = await this.repository.save(updatedSeed)

        const val = plainToInstance(SeedDto, savedSeed, {
            // excludeExtraneousValues: true,
            exposeUnsetFields: false
        })
        return val
    }

    async remove(id: string): Promise<void> {
        const seedExists = await this.repository.exist({ where: { id } })

        Expect.found(seedExists, `Seed with ID ${id} not found`)

        await this.repository.delete(id)
    }
}
