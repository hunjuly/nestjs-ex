import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Seat, Theater } from './entities'
import { TheatersController } from './theaters.controller'
import { TheatersRepository } from './theaters.repository'
import { TheatersService } from './theaters.service'

@Module({
    imports: [TypeOrmModule.forFeature([Theater, Seat])],
    controllers: [TheatersController],
    providers: [TheatersService, TheatersRepository]
})
export class TheatersModule {}
