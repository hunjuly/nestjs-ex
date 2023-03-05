import { IsNotEmpty, IsUUID } from 'class-validator'
import { Schedule } from '../entities'

export class ScheduleDto {
    @IsUUID()
    id: string

    @IsNotEmpty()
    name: string

    constructor(schedule: Schedule) {
        const { id, name } = schedule

        this.id = id
        this.name = name
    }
}
