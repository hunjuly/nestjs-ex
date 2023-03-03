import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Seed } from './entities'

@Injectable()
export class SeedsRepository {
    constructor(
        @InjectRepository(Seed)
        private readonly repository: Repository<Seed>
    ) {}

    async findAll(): Promise<Seed[]> {
        return this.repository.find()
    }

    async findById(id: string): Promise<Seed> {
        return this.repository.findOneBy({ id })
    }

    async create(newSeed: Partial<Seed>): Promise<Seed> {
        return this.repository.save(newSeed)
    }

    async save(seed: Seed): Promise<Seed> {
        return this.repository.save(seed)
    }

    async remove(seed: Seed): Promise<void> {
        await this.repository.remove(seed)
    }
}
