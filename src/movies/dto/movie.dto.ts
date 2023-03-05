import { IsNotEmpty, IsUUID } from 'class-validator'
import { EntityId } from 'src/common/base'
import { Movie } from '../entities'

export class MovieDto {
    @IsUUID()
    id: EntityId

    @IsNotEmpty()
    name: string

    constructor(movie: Movie) {
        const { id, name } = movie

        this.id = id
        this.name = name
    }
}
