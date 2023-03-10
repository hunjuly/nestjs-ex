import { Type } from 'class-transformer'
import { IsLatitude, IsLongitude, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator'

export class CreateTheaterDto {
    @IsString()
    name: string

    @IsString()
    address: string

    @IsOptional()
    @IsLatitude()
    latitude?: number

    @IsOptional()
    @IsLongitude()
    longitude?: number

    @ValidateNested({ each: true })
    @Type(() => CreateSeatDto)
    seats: CreateSeatDto[]
}

export class CreateSeatDto {
    @IsString()
    row: string

    @IsNumber()
    column: number
}
