import { IsNotEmpty, IsUUID } from 'class-validator'
import { User } from '../entities'

export class UserDto {
    @IsUUID()
    id: string

    @IsNotEmpty()
    name: string

    constructor(user: User) {
        const { id, name } = user

        this.id = id
        this.name = name

        // Object.assign(this, user)
    }
}
