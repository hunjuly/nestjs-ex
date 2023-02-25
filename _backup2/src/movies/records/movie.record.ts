import { Column, Entity } from 'typeorm'
import { BaseRecord } from 'src//common/application'
import { MovieGenre, MovieRating } from '../domain'

@Entity('Movies')
export class MovieRecord extends BaseRecord {
    @Column()
    title: string
    @Column()
    plot: string
    @Column()
    runningTimeSec: number
    @Column()
    director: string
    // @Column({ enum: ['r', 'pg', 'pg-13', 'nc-17'] })
    @Column()
    rated: MovieRating
    @Column()
    genre: string
    @Column()
    releaseDate: string
}
