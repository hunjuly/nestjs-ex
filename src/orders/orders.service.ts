import { Injectable } from '@nestjs/common'
import { Expect, updateIntersection } from 'src/common'
import { EntityId, FindOption } from 'src/common/base'
import { CreateOrderDto, QueryDto, UpdateOrderDto } from './dto'
import { OrdersRepository } from './orders.repository'

@Injectable()
export class OrdersService {
    constructor(private ordersRepository: OrdersRepository) {}

    async create(createOrderDto: CreateOrderDto) {
        const order = await this.ordersRepository.create(createOrderDto)

        return order
    }

    async findAll(findOption: FindOption, queryDto?: QueryDto) {
        const orders = await this.ordersRepository.findAll(findOption, queryDto)

        return orders
    }

    async findById(id: EntityId) {
        const order = await this.ordersRepository.findById(id)

        Expect.found(order, `Order with ID ${id} not found`)

        return order
    }

    async update(id: EntityId, updateOrderDto: UpdateOrderDto) {
        const order = await this.ordersRepository.findById(id)

        Expect.found(order, `Order with ID ${id} not found`)

        const updatedOrder = updateIntersection(order, updateOrderDto)

        const savedOrder = await this.ordersRepository.save(updatedOrder)

        return savedOrder
    }

    async remove(id: EntityId) {
        const order = await this.ordersRepository.findById(id)

        Expect.found(order, `Order with ID ${id} not found`)

        await this.ordersRepository.remove(order)
    }
}
