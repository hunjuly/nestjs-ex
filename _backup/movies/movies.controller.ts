import { Body, Controller, Delete, Get, Param, Patch, Post, UseFilters, UseGuards } from '@nestjs/common'
import {
    DomainExceptionFilter,
    OrderOption,
    OrderQuery,
    PageOption,
    PageQuery
} from 'src//common/application'
import { AdminGuard } from 'src/auths'
import { CreateMovieDto, UpdateMovieDto } from './dto'
import { FieldOption, FieldQuery } from './field-option'
import { MoviesService } from './movies.service'

@UseFilters(DomainExceptionFilter)
@Controller('movies')
export class MoviesController {
    constructor(private readonly service: MoviesService) {}

    @Post()
    @UseGuards(AdminGuard)
    create(@Body() createDto: CreateMovieDto) {
        return this.service.create(createDto)
    }

    @Get()
    find(
        @PageQuery() page: PageOption,
        @OrderQuery() order?: OrderOption,
        @FieldQuery() field?: FieldOption
    ) {
        return this.service.find(page, order, field)
    }

    @Get(':id')
    findById(@Param('id') id: string) {
        return this.service.findById(id)
    }

    @Patch(':id')
    @UseGuards(AdminGuard)
    update(@Param('id') id: string, @Body() updateDto: UpdateMovieDto) {
        return this.service.update(id, updateDto)
    }

    @Delete(':id')
    @UseGuards(AdminGuard)
    remove(@Param('id') id: string) {
        return this.service.remove(id)
    }
}
