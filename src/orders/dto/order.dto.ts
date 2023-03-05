import { IsNotEmpty, IsUUID } from 'class-validator'
import { EntityId } from 'src/common/base'
import { Order } from '../entities'

export class OrderDto {
    @IsUUID()
    id: EntityId

    @IsNotEmpty()
    name: string

    constructor(order: Order) {
        const { id, name } = order

        this.id = id
        this.name = name
    }
}
