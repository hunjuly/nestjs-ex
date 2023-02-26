import { Injectable, NotFoundException } from '@nestjs/common'
import { Expect } from 'src/common'
import { CreateSeedDto } from './dto/create-seed.dto'
import { UpdateSeedDto } from './dto/update-seed.dto'
import { Seed } from './entities'
import { SeedsRepository } from './seeds.repository'

@Injectable()
export class SeedsService {
    constructor(private repository: SeedsRepository) {}

    async create(createSeedDto: CreateSeedDto): Promise<Seed> {
        const newSeed = this.repository.create(createSeedDto)

        return this.repository.save(newSeed)
    }

    async findAll(): Promise<Seed[]> {
        return this.repository.find()
    }

    async findById(id: string): Promise<Seed> {
        const seed = await this.repository.findOneBy({ id })

        Expect.found(seed, `Seed with ID ${id} not found`)

        return seed
    }

    async update(id: string, updateSeedDto: UpdateSeedDto): Promise<Seed> {
        const seed = await this.findById(id)

        const newSeed = this.repository.create(updateSeedDto)
        const updatedSeed = Object.assign(seed, newSeed)

        return this.repository.save(updatedSeed)
    }

    async remove(id: string): Promise<void> {
        const seedExists = await this.repository.exist({ where: { id } })

        if (!seedExists) {
            throw new NotFoundException(`Seed with ID ${id} not found`)
        }

        await this.repository.delete(id)
    }
}
