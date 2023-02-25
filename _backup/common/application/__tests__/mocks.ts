import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Column, Entity, Repository } from 'typeorm'
import { AggregateRoot, IDomainRepository } from 'src/common/domain'
import { BaseRecord } from '../base.record'
import { BaseRepository } from '../base.repository'
import { BaseService } from '../base.service'

export class SampleDto {
    id: string
    name: string
}

@Entity('SampleRecord')
export class SampleRecord extends BaseRecord {
    @Column({ unique: true })
    name: string
}

interface ISamplesRepository extends IDomainRepository<Sample> {
    findByName(name: string): Promise<Sample | null>
}

class Sample extends AggregateRoot {
    constructor(private repository: ISamplesRepository, id: string, public name: string) {
        super(id)
    }

    static async create(repository: ISamplesRepository, dto): Promise<Sample> {
        return repository.create(dto)
    }
}

@Injectable()
export class SamplesRepository extends BaseRepository<SampleRecord, Sample> implements ISamplesRepository {
    constructor(@InjectRepository(SampleRecord) typeorm: Repository<SampleRecord>) {
        super(typeorm)
    }

    protected recordToEntity(record: SampleRecord): Sample {
        return new Sample(this, record.id, record.name)
    }

    protected entityToRecord(entity: Partial<Sample>): Partial<SampleRecord> {
        const record = new SampleRecord()
        record.id = entity.id
        record.name = entity.name

        return record
    }

    async findByName(name: string): Promise<Sample | null> {
        const record = await this.typeorm.findOneBy({ name })

        if (record) return this.recordToEntity(record)

        return null
    }
}

@Injectable()
export class SamplesService extends BaseService<SampleRecord, Sample, SampleDto> {
    constructor(private repository: SamplesRepository) {
        super(repository)
    }

    async create(name: string): Promise<SampleDto> {
        const seed = await Sample.create(this.repository, { name })

        return this.entityToDto(seed)
    }

    protected entityToDto(sample: Sample): SampleDto {
        const { id, name } = sample

        return { id, name }
    }
}
