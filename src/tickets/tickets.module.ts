import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Ticket } from './entities'
import { TicketsController } from './tickets.controller'
import { TicketsRepository } from './tickets.repository'
import { TicketsService } from './tickets.service'

@Module({
    imports: [TypeOrmModule.forFeature([Ticket])],
    controllers: [TicketsController],
    providers: [TicketsService, TicketsRepository]
})
export class TicketsModule {}
