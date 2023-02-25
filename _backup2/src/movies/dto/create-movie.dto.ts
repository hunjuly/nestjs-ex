import { IsNotEmpty } from 'class-validator'
import { MovieGenre, MovieRating } from '../domain'

export class CreateMovieDto {
    @IsNotEmpty()
    title: string
    @IsNotEmpty()
    plot: string
    @IsNotEmpty()
    runningTimeSec: number
    @IsNotEmpty()
    director: string
    @IsNotEmpty()
    rated: MovieRating
    @IsNotEmpty()
    genre: MovieGenre[]
    @IsNotEmpty()
    releaseDate: string
}
