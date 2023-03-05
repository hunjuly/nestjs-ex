import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { EntityId, FindOption, FindQuery } from 'src/common/base'
import { CreateScheduleDto, QueryDto, ScheduleDto, UpdateScheduleDto } from './dto'
import { SchedulesService } from './schedules.service'

@Controller('schedules')
export class SchedulesController {
    constructor(private readonly schedulesService: SchedulesService) {}

    @Post()
    async create(@Body() createScheduleDto: CreateScheduleDto) {
        const schedule = await this.schedulesService.create(createScheduleDto)

        return new ScheduleDto(schedule)
    }

    @Get()
    async findAll(@FindQuery() findOption: FindOption, @Query() query: QueryDto) {
        const schedules = await this.schedulesService.findAll(findOption, query)

        const items = schedules.items.map((schedule) => new ScheduleDto(schedule))

        return { ...schedules, items }
    }

    @Get(':id')
    async findById(@Param('id') id: EntityId) {
        const schedule = await this.schedulesService.findById(id)

        return new ScheduleDto(schedule)
    }

    @Patch(':id')
    async update(@Param('id') id: EntityId, @Body() updateScheduleDto: UpdateScheduleDto) {
        const schedule = await this.schedulesService.update(id, updateScheduleDto)

        return new ScheduleDto(schedule)
    }

    @Delete(':id')
    async remove(@Param('id') id: EntityId) {
        return this.schedulesService.remove(id)
    }
}
