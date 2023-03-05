import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Theater } from './entities'
import { TheatersController } from './theaters.controller'
import { TheatersRepository } from './theaters.repository'
import { TheatersService } from './theaters.service'

@Module({
    imports: [TypeOrmModule.forFeature([Theater])],
    controllers: [TheatersController],
    providers: [TheatersService, TheatersRepository]
})
export class TheatersModule {}
