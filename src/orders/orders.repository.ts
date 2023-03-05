import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { BaseRepository, FindOption, PaginatedResult } from 'src/common/base'
import { QueryDto } from './dto'
import { Order } from './entities'

@Injectable()
export class OrdersRepository extends BaseRepository<Order> {
    constructor(@InjectRepository(Order) typeorm: Repository<Order>, protected dataSource: DataSource) {
        super(typeorm, dataSource)
    }

    async findAll(findOption: FindOption, queryDto: QueryDto): Promise<PaginatedResult<Order>> {
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
