import { IsDateString, IsEmail, IsString, IsUUID } from 'class-validator'
import { User } from '../entities'

export class UserDto {
    @IsUUID()
    id: string

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
