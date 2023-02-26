import { Injectable } from '@nestjs/common'
import { CreateSeedDto } from './dto/create-seed.dto'
import { UpdateSeedDto } from './dto/update-seed.dto'
import { Seed } from './entities'
import { SeedsRepository } from './repositories'

@Injectable()
export class SeedsService {
    constructor(private seedsRepository: SeedsRepository) {}

    async create(createSeedDto: CreateSeedDto): Promise<Seed> {
        return await this.seedsRepository.create(createSeedDto)
    }

    async findAll(): Promise<Seed[]> {
        return await this.seedsRepository.findAll()
    }

    async findOne(id: number): Promise<Seed> {
        return await this.seedsRepository.findOne(id)
    }

    async update(id: number, updateSeedDto: UpdateSeedDto): Promise<Seed> {
        return await this.seedsRepository.update(id, updateSeedDto)
    }

    async remove(id: number): Promise<void> {
        return await this.seedsRepository.remove(id)
    }
}
