import { IsNotEmpty, IsUUID } from 'class-validator'
import { Movie } from '../entities'

export class MovieDto {
    @IsUUID()
    id: string

    @IsNotEmpty()
    name: string

    constructor(movie: Movie) {
        const { id, name } = movie

        this.id = id
        this.name = name
    }
}
