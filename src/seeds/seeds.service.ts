import { Injectable } from '@nestjs/common'
import { plainToClass, plainToInstance } from 'class-transformer'
import { Expect, updateIntersection } from 'src/common'
import { SeedDto } from './dto'
import { CreateSeedDto } from './dto/create-seed.dto'
import { UpdateSeedDto } from './dto/update-seed.dto'
import { Seed } from './entities'
import { SeedsRepository } from './seeds.repository'

@Injectable()
export class SeedsService {
    constructor(private repository: SeedsRepository) {}

    entityToDto(entity: Seed): SeedDto {
        const { id, name } = entity

        return {
            id,
            name
        }
    }

    async create(createSeedDto: CreateSeedDto): Promise<SeedDto> {
        const newSeed = this.repository.create(createSeedDto)
        const seed = await this.repository.save(newSeed)

        return this.entityToDto(seed)
    }

    async findAll(): Promise<SeedDto[]> {
        const seeds = await this.repository.find()

        return seeds.map((seed) => this.entityToDto(seed))
    }

    async findById(id: string): Promise<SeedDto> {
        const seed = await this.repository.findOneBy({ id })

        Expect.found(seed, `Seed with ID ${id} not found`)

        return this.entityToDto(seed)
    }

    async update(id: string, updateSeedDto: UpdateSeedDto): Promise<SeedDto> {
        const seed = await this.repository.findOneBy({ id })

        Expect.found(seed, `Seed with ID ${id} not found`)

        const updatedSeed = updateIntersection(seed, updateSeedDto)

        const savedSeed = await this.repository.save(updatedSeed)

        return this.entityToDto(savedSeed)
    }

    async remove(id: string): Promise<void> {
        const seedExists = await this.repository.exist({ where: { id } })

        Expect.found(seedExists, `Seed with ID ${id} not found`)

        await this.repository.delete(id)
    }
}
