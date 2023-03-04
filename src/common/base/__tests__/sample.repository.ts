import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Column, DataSource, Entity, Repository } from 'typeorm'
import { AggregateRoot } from '../aggregate-root'
import { BaseRepository } from '../base.repository'
import { FindOption, PaginatedResult } from '../find-option'

@Entity()
export class Sample extends AggregateRoot {
    @Column()
    name: string
}

export class QueryDto {
    search?: string
}

@Injectable()
export class SampleRepository extends BaseRepository<Sample> {
    constructor(@InjectRepository(Sample) typeorm: Repository<Sample>, dataSource: DataSource) {
        super(typeorm, dataSource)
    }

    async findAll(findOption: FindOption, queryDto: QueryDto): Promise<PaginatedResult<Sample>> {
        if (queryDto.search) {
            return this.find(findOption, {
                where: 'entity.name LIKE :search',
                params: {
                    search: `%${queryDto.search}%`
                }
            })
        }

        return this.find(findOption)
    }
}
