import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { EntityId, FindOption, FindQuery } from 'src/common/base'
import { CreateMovieDto, MovieResponseDto, UpdateMovieDto } from './dto'
import { MoviesService } from './movies.service'

@Controller('movies')
export class MoviesController {
    constructor(private readonly moviesService: MoviesService) {}

    @Post()
    async create(@Body() createMovieDto: CreateMovieDto) {
        const movie = await this.moviesService.create(createMovieDto)

        return new MovieResponseDto(movie)
    }

    @Get()
    async findAll(@FindQuery() findOption: FindOption) {
        const movies = await this.moviesService.findAll(findOption)

        const items = movies.items.map((movie) => new MovieResponseDto(movie))

        return { ...movies, items }
    }

    @Get(':id')
    async findById(@Param('id') id: EntityId) {
        const movie = await this.moviesService.findById(id)

        return new MovieResponseDto(movie)
    }

    @Patch(':id')
    async update(@Param('id') id: EntityId, @Body() updateMovieDto: UpdateMovieDto) {
        const movie = await this.moviesService.update(id, updateMovieDto)

        return new MovieResponseDto(movie)
    }

    @Delete(':id')
    async remove(@Param('id') id: EntityId) {
        return this.moviesService.remove(id)
    }
}
