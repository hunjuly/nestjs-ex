import { AggregateRoot } from 'src/common/domain'
import { IMoviesRepository } from './interfaces'
import { CreateMovieCmd, MovieGenre, MovieRating, UpdateMovieCmd } from './types'

export class Movie extends AggregateRoot {
    constructor(
        private repository: IMoviesRepository,
        id: string,
        public title: string,
        public plot: string,
        public runningTimeSec: number,
        public director: string,
        public rated: MovieRating,
        public genre: MovieGenre[],
        public releaseDate: string
    ) {
        super(id)
    }

    static async create(repository: IMoviesRepository, cmd: CreateMovieCmd): Promise<Movie> {
        const movie = await repository.create(cmd)

        return movie
    }

    async update(cmd: UpdateMovieCmd): Promise<void> {
        Object.keys(this).forEach((key: string) => {
            if (cmd[key]) {
                this[key] = cmd[key]
            }
        })

        await this.repository.update(this.id, cmd)
    }
}
