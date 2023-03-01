import { IsDateString, IsNotEmpty, IsString } from 'class-validator'

export class CreateUserDto {
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

    @IsNotEmpty()
    @IsString()
    password: string
}
