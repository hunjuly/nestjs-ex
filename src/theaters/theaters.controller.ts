import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { FindOption, FindQuery } from 'src/common/base'
import { CreateTheaterDto, QueryDto, TheaterDto, UpdateTheaterDto } from './dto'
import { TheatersService } from './theaters.service'

@Controller('theaters')
export class TheatersController {
    constructor(private readonly theatersService: TheatersService) {}

    @Post()
    async create(@Body() createTheaterDto: CreateTheaterDto) {
        const theater = await this.theatersService.create(createTheaterDto)

        return new TheaterDto(theater)
    }

    @Get()
    async findAll(@FindQuery() findOption: FindOption, @Query() query: QueryDto) {
        const theaters = await this.theatersService.findAll(findOption, query)

        const items = theaters.items.map((theater) => new TheaterDto(theater))

        return { ...theaters, items }
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        const theater = await this.theatersService.findById(id)

        return new TheaterDto(theater)
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateTheaterDto: UpdateTheaterDto) {
        const theater = await this.theatersService.update(id, updateTheaterDto)

        return new TheaterDto(theater)
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.theatersService.remove(id)
    }
}
