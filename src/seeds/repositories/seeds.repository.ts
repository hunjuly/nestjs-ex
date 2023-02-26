import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateSeedDto } from '../dto/create-seed.dto'
import { UpdateSeedDto } from '../dto/update-seed.dto'
import { Seed } from '../entities/seed.entity'

@Injectable()
export class SeedsRepository {
    constructor(
        @InjectRepository(Seed)
        private seedsRepository: Repository<Seed>
    ) {}

    async create(createSeedDto: CreateSeedDto): Promise<Seed> {
        const newSeed = await this.seedsRepository.create(createSeedDto)

        return this.seedsRepository.save(newSeed)
    }

    async findAll(): Promise<Seed[]> {
        return this.seedsRepository.find()
    }

    async findOne(id: number): Promise<Seed> {
        return this.seedsRepository.findOneBy({ id })
    }

    async update(id: number, updateSeedDto: UpdateSeedDto): Promise<Seed> {
        const seed = await this.seedsRepository.findOneBy({ id })

        if (!seed) {
            return null
        }

        const updatedSeed = Object.assign(seed, updateSeedDto)

        return this.seedsRepository.save(updatedSeed)
    }

    async remove(id: number): Promise<void> {
        await this.seedsRepository.delete(id)
    }
}
