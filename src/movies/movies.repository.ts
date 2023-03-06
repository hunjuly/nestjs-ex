import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { BaseRepository, FindOption, PaginatedResult } from 'src/common/base'
import { Movie } from './entities'

@Injectable()
export class MoviesRepository extends BaseRepository<Movie> {
    constructor(@InjectRepository(Movie) typeorm: Repository<Movie>, protected dataSource: DataSource) {
        super(typeorm, dataSource)
    }

    async findAll(findOption: FindOption): Promise<PaginatedResult<Movie>> {
        return this.find(findOption)
    }
}
