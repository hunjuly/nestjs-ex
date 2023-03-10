import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator'
import { EntityId } from 'src/common/base'
import { Seat, Theater } from '../entities'

export class SeatDto {
    @IsNumber()
    id: number

    @IsString()
    row: string

    @IsNumber()
    column: number

    constructor(seat: Seat) {
        const { id, row, column } = seat

        this.id = id
        this.row = row
        this.column = column
    }
}

export class TheaterDto {
    @IsUUID()
    id: EntityId

    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    address: string

    @IsNotEmpty()
    latitude: number

    @IsNotEmpty()
    longitude: number

    seats: SeatDto[]

    constructor(theater: Theater) {
        const { id, name, address, latitude, longitude, seats } = theater

        this.id = id
        this.name = name
        this.address = address
        this.latitude = latitude
        this.longitude = longitude
        this.seats = seats.map((seat) => new SeatDto(seat))
    }
}
