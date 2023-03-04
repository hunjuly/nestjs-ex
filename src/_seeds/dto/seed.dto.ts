import { IsNotEmpty, IsUUID } from 'class-validator'
import { Seed } from '../entities'

export class SeedDto {
    @IsUUID()
    id: string

    @IsNotEmpty()
    name: string

    constructor(seed: Seed) {
        const { id, name } = seed

        this.id = id
        this.name = name
    }
}
