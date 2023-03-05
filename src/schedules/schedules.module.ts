import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Schedule } from './entities'
import { SchedulesController } from './schedules.controller'
import { SchedulesRepository } from './schedules.repository'
import { SchedulesService } from './schedules.service'

@Module({
    imports: [TypeOrmModule.forFeature([Schedule])],
    controllers: [SchedulesController],
    providers: [SchedulesService, SchedulesRepository]
})
export class SchedulesModule {}
