import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { EntityId, FindOption, FindQuery } from 'src/common/base'
import { CreateMovieDto, MovieDto, QueryDto, UpdateMovieDto } from './dto'
import { MoviesService } from './movies.service'

@Controller('movies')
export class MoviesController {
    constructor(private readonly moviesService: MoviesService) {}

    @Post()
    async create(@Body() createMovieDto: CreateMovieDto) {
        const movie = await this.moviesService.create(createMovieDto)

        return new MovieDto(movie)
    }

    @Get()
    async findAll(@FindQuery() findOption: FindOption, @Query() query: QueryDto) {
        const movies = await this.moviesService.findAll(findOption, query)

        const items = movies.items.map((movie) => new MovieDto(movie))

        return { ...movies, items }
    }

    @Get(':id')
    async findById(@Param('id') id: EntityId) {
        const movie = await this.moviesService.findById(id)

        return new MovieDto(movie)
    }

    @Patch(':id')
    async update(@Param('id') id: EntityId, @Body() updateMovieDto: UpdateMovieDto) {
        const movie = await this.moviesService.update(id, updateMovieDto)

        return new MovieDto(movie)
    }

    @Delete(':id')
    async remove(@Param('id') id: EntityId) {
        return this.moviesService.remove(id)
    }
}
