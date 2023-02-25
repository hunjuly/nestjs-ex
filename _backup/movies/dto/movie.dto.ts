import { MovieGenre, MovieRating } from '../domain'

export class MovieDto {
    id: string
    title: string
    plot: string
    runningTimeSec: number
    director: string
    rated: MovieRating
    genre: MovieGenre[]
    releaseDate: string
}
