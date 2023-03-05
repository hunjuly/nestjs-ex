import { Injectable } from '@nestjs/common'
import { Expect, updateIntersection } from 'src/common'
import { FindOption } from 'src/common/base'
import { CreateMovieDto, QueryDto, UpdateMovieDto } from './dto'
import { MoviesRepository } from './movies.repository'

@Injectable()
export class MoviesService {
    constructor(private moviesRepository: MoviesRepository) {}

    async create(createMovieDto: CreateMovieDto) {
        const movie = await this.moviesRepository.create(createMovieDto)

        return movie
    }

    async findAll(findOption: FindOption, queryDto?: QueryDto) {
        const movies = await this.moviesRepository.findAll(findOption, queryDto)

        return movies
    }

    async findById(id: string) {
        const movie = await this.moviesRepository.findById(id)

        Expect.found(movie, `Movie with ID ${id} not found`)

        return movie
    }

    async update(id: string, updateMovieDto: UpdateMovieDto) {
        const movie = await this.moviesRepository.findById(id)

        Expect.found(movie, `Movie with ID ${id} not found`)

        const updatedMovie = updateIntersection(movie, updateMovieDto)

        const savedMovie = await this.moviesRepository.save(updatedMovie)

        return savedMovie
    }

    async remove(id: string) {
        const movie = await this.moviesRepository.findById(id)

        Expect.found(movie, `Movie with ID ${id} not found`)

        await this.moviesRepository.remove(movie)
    }
}
