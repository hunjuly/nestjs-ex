import { Injectable, NotFoundException } from '@nestjs/common'
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter'
import { BaseService } from 'src//common/application'
import { Seed } from './domain'
import { CreateSeedDto, SeedDto, UpdateSeedDto } from './dto'
import { SeedRecord } from './records/seed.record'
import { SeedsRepository } from './seeds.repository'

@Injectable()
export class SeedsService extends BaseService<SeedRecord, Seed, SeedDto> {
    constructor(private repository: SeedsRepository, private eventEmitter: EventEmitter2) {
        super(repository)
    }

    @OnEvent('seed.created')
    handleEvents(_seed: Seed) {}

    async create(createDto: CreateSeedDto): Promise<SeedDto> {
        const seed = await Seed.create(this.repository, createDto)

        this.eventEmitter.emit('seed.created', seed)

        return this.entityToDto(seed)
    }

    async update(id: string, updateDto: UpdateSeedDto): Promise<SeedDto> {
        const seed = await this.repository.findById(id)

        if (!seed) throw new NotFoundException()

        await seed.update(updateDto)

        return this.entityToDto(seed)
    }

    protected entityToDto(seed: Seed): SeedDto {
        return {
            id: seed.id,
            name: seed.name
        }
    }
}
