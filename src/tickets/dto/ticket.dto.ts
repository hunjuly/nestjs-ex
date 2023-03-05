import { IsNotEmpty, IsUUID } from 'class-validator'
import { Ticket } from '../entities'

export class TicketDto {
    @IsUUID()
    id: string

    @IsNotEmpty()
    name: string

    constructor(ticket: Ticket) {
        const { id, name } = ticket

        this.id = id
        this.name = name
    }
}
