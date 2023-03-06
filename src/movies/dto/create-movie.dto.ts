import { IsArray, IsDate, IsEnum, IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator'
import { Genre, Rated } from '../entities'

export class CreateMovieDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    title: string

    @IsNotEmpty()
    @IsString()
    @MaxLength(5000)
    plot: string

    @IsNotEmpty()
    @IsInt()
    runningTimeInMinutes: number

    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    director: string

    @IsNotEmpty()
    @IsEnum(Rated)
    rated: Rated

    @IsNotEmpty()
    @IsArray()
    @IsEnum(Genre, { each: true })
    genres: Genre[]

    @IsNotEmpty()
    @IsDate()
    releaseDate: Date
}
