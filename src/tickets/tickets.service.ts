import { Injectable } from '@nestjs/common'
import { Expect, updateIntersection } from 'src/common'
import { FindOption } from 'src/common/base'
import { CreateTicketDto, QueryDto, UpdateTicketDto } from './dto'
import { TicketsRepository } from './tickets.repository'

@Injectable()
export class TicketsService {
    constructor(private ticketsRepository: TicketsRepository) {}

    async create(createTicketDto: CreateTicketDto) {
        const ticket = await this.ticketsRepository.create(createTicketDto)

        return ticket
    }

    async findAll(findOption: FindOption, queryDto?: QueryDto) {
        const tickets = await this.ticketsRepository.findAll(findOption, queryDto)

        return tickets
    }

    async findById(id: string) {
        const ticket = await this.ticketsRepository.findById(id)

        Expect.found(ticket, `Ticket with ID ${id} not found`)

        return ticket
    }

    async update(id: string, updateTicketDto: UpdateTicketDto) {
        const ticket = await this.ticketsRepository.findById(id)

        Expect.found(ticket, `Ticket with ID ${id} not found`)

        const updatedTicket = updateIntersection(ticket, updateTicketDto)

        const savedTicket = await this.ticketsRepository.save(updatedTicket)

        return savedTicket
    }

    async remove(id: string) {
        const ticket = await this.ticketsRepository.findById(id)

        Expect.found(ticket, `Ticket with ID ${id} not found`)

        await this.ticketsRepository.remove(ticket)
    }
}
