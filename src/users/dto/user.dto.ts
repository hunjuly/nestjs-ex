import { IsDateString, IsNotEmpty, IsString, IsUUID } from 'class-validator'
import { User } from '../entities'

export class UserDto {
    @IsUUID()
    id: string

    @IsNotEmpty()
    @IsString()
    username: string

    @IsNotEmpty()
    @IsString()
    firstName: string

    @IsNotEmpty()
    @IsString()
    lastName: string

    @IsDateString()
    birthdate: Date

    constructor(user: User) {
        const { id, username, firstName, lastName, birthdate } = user

        this.id = id
        this.username = username
        this.firstName = firstName
        this.lastName = lastName
        this.birthdate = birthdate
    }
}
