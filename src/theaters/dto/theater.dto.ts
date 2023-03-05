import { IsNotEmpty, IsUUID } from 'class-validator'
import { EntityId } from 'src/common/base'
import { Theater } from '../entities'

export class TheaterDto {
    @IsUUID()
    id: EntityId

    @IsNotEmpty()
    name: string

    constructor(theater: Theater) {
        const { id, name } = theater

        this.id = id
        this.name = name
    }
}
