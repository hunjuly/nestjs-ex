import { IsNotEmpty, IsUUID } from 'class-validator'
import { Payment } from '../entities'

export class PaymentDto {
    @IsUUID()
    id: string

    @IsNotEmpty()
    name: string

    constructor(payment: Payment) {
        const { id, name } = payment

        this.id = id
        this.name = name
    }
}
