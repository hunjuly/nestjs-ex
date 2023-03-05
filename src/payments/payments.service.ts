import { Injectable } from '@nestjs/common'
import { Expect, updateIntersection } from 'src/common'
import { EntityId, FindOption } from 'src/common/base'
import { CreatePaymentDto, QueryDto, UpdatePaymentDto } from './dto'
import { PaymentsRepository } from './payments.repository'

@Injectable()
export class PaymentsService {
    constructor(private paymentsRepository: PaymentsRepository) {}

    async create(createPaymentDto: CreatePaymentDto) {
        const payment = await this.paymentsRepository.create(createPaymentDto)

        return payment
    }

    async findAll(findOption: FindOption, queryDto?: QueryDto) {
        const payments = await this.paymentsRepository.findAll(findOption, queryDto)

        return payments
    }

    async findById(id: EntityId) {
        const payment = await this.paymentsRepository.findById(id)

        Expect.found(payment, `Payment with ID ${id} not found`)

        return payment
    }

    async update(id: EntityId, updatePaymentDto: UpdatePaymentDto) {
        const payment = await this.paymentsRepository.findById(id)

        Expect.found(payment, `Payment with ID ${id} not found`)

        const updatedPayment = updateIntersection(payment, updatePaymentDto)

        const savedPayment = await this.paymentsRepository.save(updatedPayment)

        return savedPayment
    }

    async remove(id: EntityId) {
        const payment = await this.paymentsRepository.findById(id)

        Expect.found(payment, `Payment with ID ${id} not found`)

        await this.paymentsRepository.remove(payment)
    }
}
