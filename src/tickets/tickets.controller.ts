import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { EntityId, FindOption, FindQuery } from 'src/common/base'
import { CreateTicketDto, QueryDto, TicketDto, UpdateTicketDto } from './dto'
import { TicketsService } from './tickets.service'

@Controller('tickets')
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) {}

    @Post()
    async create(@Body() createTicketDto: CreateTicketDto) {
        const ticket = await this.ticketsService.create(createTicketDto)

        return new TicketDto(ticket)
    }

    @Get()
    async findAll(@FindQuery() findOption: FindOption, @Query() query: QueryDto) {
        const tickets = await this.ticketsService.findAll(findOption, query)

        const items = tickets.items.map((ticket) => new TicketDto(ticket))

        return { ...tickets, items }
    }

    @Get(':id')
    async findById(@Param('id') id: EntityId) {
        const ticket = await this.ticketsService.findById(id)

        return new TicketDto(ticket)
    }

    @Patch(':id')
    async update(@Param('id') id: EntityId, @Body() updateTicketDto: UpdateTicketDto) {
        const ticket = await this.ticketsService.update(id, updateTicketDto)

        return new TicketDto(ticket)
    }

    @Delete(':id')
    async remove(@Param('id') id: EntityId) {
        return this.ticketsService.remove(id)
    }
}
