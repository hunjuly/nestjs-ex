import { IsNotEmpty, IsUUID } from 'class-validator'
import { Order } from '../entities'

export class OrderDto {
    @IsUUID()
    id: string

    @IsNotEmpty()
    name: string

    constructor(order: Order) {
        const { id, name } = order

        this.id = id
        this.name = name
    }
}
