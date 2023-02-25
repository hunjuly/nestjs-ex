import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseRepository } from 'src//common/application'
import { ISeedsRepository, Seed } from './domain'
import { SeedRecord } from './records/seed.record'

@Injectable()
export class SeedsRepository extends BaseRepository<SeedRecord, Seed> implements ISeedsRepository {
    constructor(@InjectRepository(SeedRecord) typeorm: Repository<SeedRecord>) {
        super(typeorm)
    }

    protected recordToEntity(record: SeedRecord): Seed {
        return new Seed(this, record.id, record.name)
    }

    protected entityToRecord(entity: Partial<Seed>): Partial<SeedRecord> {
        const record = new SeedRecord()
        record.id = entity.id
        record.name = entity.name

        return record
    }

    async findByName(name: string): Promise<Seed | null> {
        const record = await this.typeorm.findOneBy({ name })

        if (record) return this.recordToEntity(record)

        return null
    }
}
