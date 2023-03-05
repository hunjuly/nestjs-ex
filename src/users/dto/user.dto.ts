import { IsDateString, IsEmail, IsString, IsUUID } from 'class-validator'
import { EntityId } from 'src/common/base'
import { User } from '../entities'

export class UserDto {
    @IsUUID()
    id: EntityId

    @IsEmail()
    email: string

    @IsString()
    username: string

    @IsString()
    firstName: string

    @IsString()
    lastName: string

    @IsDateString()
    birthdate: Date

    constructor(user: User) {
        const { id, email, username, firstName, lastName, birthdate } = user

        this.id = id
        this.email = email
        this.username = username
        this.firstName = firstName
        this.lastName = lastName
        this.birthdate = birthdate
    }
}
