import { IsNotEmpty, IsUUID } from 'class-validator'
import { EntityId } from 'src/common/base'
import { Payment } from '../entities'

export class PaymentDto {
    @IsUUID()
    id: EntityId

    @IsNotEmpty()
    name: string

    constructor(payment: Payment) {
        const { id, name } = payment

        this.id = id
        this.name = name
    }
}
