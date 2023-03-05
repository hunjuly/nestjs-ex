import { IsNotEmpty, IsUUID } from 'class-validator'
import { EntityId } from 'src/common/base'
import { Ticket } from '../entities'

export class TicketDto {
    @IsUUID()
    id: EntityId

    @IsNotEmpty()
    name: string

    constructor(ticket: Ticket) {
        const { id, name } = ticket

        this.id = id
        this.name = name
    }
}
