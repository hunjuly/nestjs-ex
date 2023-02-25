import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { BaseService, OrderOption, PageOption, PaginatedResult } from 'src//common/application'
import { Movie } from './domain'
import { CreateMovieDto, MovieDto, UpdateMovieDto } from './dto'
import { FieldOption } from './field-option'
import { MoviesRepository } from './movies.repository'
import { MovieRecord } from './records/movie.record'

@Injectable()
export class MoviesService extends BaseService<MovieRecord, Movie, MovieDto> {
    constructor(private repository: MoviesRepository) {
        super(repository)
    }

    async find(
        page: PageOption,
        order?: OrderOption,
        field?: FieldOption
    ): Promise<PaginatedResult<MovieDto>> {
        if (field) {
        }

        return super.find(page, order)

        // if (order && !this.repository.hasColumn(order.name)) {
        //     throw new BadRequestException('unknown field name, ' + order.name)
        // }

        // const { items, ...result } = await this.baseRepository.find(page, order)

        // const dtos: Dto[] = []

        // items.forEach((item) => {
        //     const dto = this.entityToDto(item)
        //     dtos.push(dto)
        // })

        // return { ...result, items: dtos }
    }

    async create(createDto: CreateMovieDto): Promise<MovieDto> {
        const movie = await Movie.create(this.repository, createDto)

        return this.entityToDto(movie)
    }

    async update(id: string, updateDto: UpdateMovieDto): Promise<MovieDto> {
        const movie = await this.repository.findById(id)

        if (!movie) throw new NotFoundException()

        await movie.update(updateDto)

        return this.entityToDto(movie)
    }

    protected entityToDto(movie: Movie): MovieDto {
        return {
            id: movie.id,
            title: movie.title,
            plot: movie.plot,
            runningTimeSec: movie.runningTimeSec,
            director: movie.director,
            rated: movie.rated,
            genre: movie.genre,
            releaseDate: movie.releaseDate
        }
    }
}
