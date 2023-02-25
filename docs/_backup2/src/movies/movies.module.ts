import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MoviesController } from './movies.controller'
import { MoviesRepository } from './movies.repository'
import { MoviesService } from './movies.service'
import { MovieRecord } from './records/movie.record'

@Module({
    imports: [TypeOrmModule.forFeature([MovieRecord])],
    controllers: [MoviesController],
    providers: [MoviesService, MoviesRepository]
})
export class MoviesModule {}
