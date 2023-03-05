import { Injectable } from '@nestjs/common'
import { Expect, updateIntersection } from 'src/common'
import { FindOption } from 'src/common/base'
import { CreateScheduleDto, QueryDto, UpdateScheduleDto } from './dto'
import { SchedulesRepository } from './schedules.repository'

@Injectable()
export class SchedulesService {
    constructor(private schedulesRepository: SchedulesRepository) {}

    async create(createScheduleDto: CreateScheduleDto) {
        const schedule = await this.schedulesRepository.create(createScheduleDto)

        return schedule
    }

    async findAll(findOption: FindOption, queryDto?: QueryDto) {
        const schedules = await this.schedulesRepository.findAll(findOption, queryDto)

        return schedules
    }

    async findById(id: string) {
        const schedule = await this.schedulesRepository.findById(id)

        Expect.found(schedule, `Schedule with ID ${id} not found`)

        return schedule
    }

    async update(id: string, updateScheduleDto: UpdateScheduleDto) {
        const schedule = await this.schedulesRepository.findById(id)

        Expect.found(schedule, `Schedule with ID ${id} not found`)

        const updatedSchedule = updateIntersection(schedule, updateScheduleDto)

        const savedSchedule = await this.schedulesRepository.save(updatedSchedule)

        return savedSchedule
    }

    async remove(id: string) {
        const schedule = await this.schedulesRepository.findById(id)

        Expect.found(schedule, `Schedule with ID ${id} not found`)

        await this.schedulesRepository.remove(schedule)
    }
}
