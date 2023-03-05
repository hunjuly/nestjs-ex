import { IsNotEmpty, IsUUID } from 'class-validator'
import { Theater } from '../entities'

export class TheaterDto {
    @IsUUID()
    id: string

    @IsNotEmpty()
    name: string

    constructor(theater: Theater) {
        const { id, name } = theater

        this.id = id
        this.name = name
    }
}
