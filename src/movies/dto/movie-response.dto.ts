import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator'
import { EntityId } from 'src/common/base'
import { Genre, Movie, Rated } from '../entities'

export class MovieResponseDto {
    @IsUUID()
    id: EntityId

    @IsNotEmpty()
    readonly title: string

    @IsNotEmpty()
    readonly plot: string

    @IsNotEmpty()
    readonly runningTimeInMinutes: number

    @IsNotEmpty()
    readonly director: string

    @IsEnum(Rated)
    @IsNotEmpty()
    readonly rated: Rated

    @IsEnum(Genre, { each: true })
    @IsNotEmpty({ each: true })
    readonly genres: Genre[]

    @IsNotEmpty()
    readonly releaseDate: Date

    constructor(movie: Movie) {
        const { id, title, plot, runningTimeInMinutes, director, rated, genres, releaseDate } = movie

        this.id = id
        this.title = title
        this.plot = plot
        this.runningTimeInMinutes = runningTimeInMinutes
        this.director = director
        this.rated = rated
        this.genres = genres
        this.releaseDate = releaseDate
    }
}
