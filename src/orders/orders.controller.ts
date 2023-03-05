import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { EntityId, FindOption, FindQuery } from 'src/common/base'
import { CreateOrderDto, OrderDto, QueryDto, UpdateOrderDto } from './dto'
import { OrdersService } from './orders.service'

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @Post()
    async create(@Body() createOrderDto: CreateOrderDto) {
        const order = await this.ordersService.create(createOrderDto)

        return new OrderDto(order)
    }

    @Get()
    async findAll(@FindQuery() findOption: FindOption, @Query() query: QueryDto) {
        const orders = await this.ordersService.findAll(findOption, query)

        const items = orders.items.map((order) => new OrderDto(order))

        return { ...orders, items }
    }

    @Get(':id')
    async findById(@Param('id') id: EntityId) {
        const order = await this.ordersService.findById(id)

        return new OrderDto(order)
    }

    @Patch(':id')
    async update(@Param('id') id: EntityId, @Body() updateOrderDto: UpdateOrderDto) {
        const order = await this.ordersService.update(id, updateOrderDto)

        return new OrderDto(order)
    }

    @Delete(':id')
    async remove(@Param('id') id: EntityId) {
        return this.ordersService.remove(id)
    }
}
