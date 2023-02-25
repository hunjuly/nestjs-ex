import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseRepository } from 'src//common/application'
import { IMoviesRepository, Movie } from './domain'
import { MovieRecord } from './records/movie.record'

@Injectable()
export class MoviesRepository extends BaseRepository<MovieRecord, Movie> implements IMoviesRepository {
    constructor(@InjectRepository(MovieRecord) typeorm: Repository<MovieRecord>) {
        super(typeorm)
    }

    protected recordToEntity(record: MovieRecord): Movie | null {
        return new Movie(
            this,
            record.id,
            record.title,
            record.plot,
            record.runningTimeSec,
            record.director,
            record.rated,
            JSON.parse(record.genre),
            record.releaseDate
        )
    }

    protected entityToRecord(entity: Partial<Movie>): Partial<MovieRecord> | null {
        const record = new MovieRecord()
        record.id = entity.id
        record.title = entity.title
        record.plot = entity.plot
        record.runningTimeSec = entity.runningTimeSec
        record.director = entity.director
        record.rated = entity.rated
        record.releaseDate = entity.releaseDate

        if (entity.genre) record.genre = JSON.stringify(entity.genre)

        return record
    }

    async findByTitle(title: string): Promise<Movie | null> {
        const record = await this.typeorm.findOneBy({ title })

        if (record) return this.recordToEntity(record)

        return null
    }
}
