import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { BaseRepository, FindOption, PaginatedResult } from 'src/common/base'
import { QueryDto } from './dto'
import { Ticket } from './entities'

@Injectable()
export class TicketsRepository extends BaseRepository<Ticket> {
    constructor(@InjectRepository(Ticket) typeorm: Repository<Ticket>, protected dataSource: DataSource) {
        super(typeorm, dataSource)
    }

    async findAll(findOption: FindOption, queryDto: QueryDto): Promise<PaginatedResult<Ticket>> {
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
