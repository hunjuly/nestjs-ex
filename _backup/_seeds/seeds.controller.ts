import { Body, Controller, Delete, Get, Param, Patch, Post, UseFilters, UseGuards } from '@nestjs/common'
import {
    DomainExceptionFilter,
    OrderOption,
    OrderQuery,
    PageOption,
    PageQuery
} from 'src//common/application'
import { AdminGuard, SelfGuard } from 'src/auths'
import { CreateSeedDto, UpdateSeedDto } from './dto'
import { SeedsService } from './seeds.service'

@UseFilters(DomainExceptionFilter)
@Controller('seeds')
export class SeedsController {
    constructor(private readonly service: SeedsService) {}

    @Post()
    create(@Body() createDto: CreateSeedDto) {
        return this.service.create(createDto)
    }

    @Get()
    find(@PageQuery() page: PageOption, @OrderQuery() order?: OrderOption) {
        return this.service.find(page, order)
    }

    @UseGuards(SelfGuard)
    @Get(':id')
    findById(@Param('id') id: string) {
        return this.service.findById(id)
    }

    @UseGuards(SelfGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDto: UpdateSeedDto) {
        return this.service.update(id, updateDto)
    }

    @UseGuards(AdminGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.service.remove(id)
    }
}
