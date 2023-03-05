import { IsNotEmpty, IsUUID } from 'class-validator'
import { EntityId } from 'src/common/base'
import { Schedule } from '../entities'

export class ScheduleDto {
    @IsUUID()
    id: EntityId

    @IsNotEmpty()
    name: string

    constructor(schedule: Schedule) {
        const { id, name } = schedule

        this.id = id
        this.name = name
    }
}
