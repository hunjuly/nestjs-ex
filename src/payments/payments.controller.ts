import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { EntityId, FindOption, FindQuery } from 'src/common/base'
import { CreatePaymentDto, PaymentDto, QueryDto, UpdatePaymentDto } from './dto'
import { PaymentsService } from './payments.service'

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) {}

    @Post()
    async create(@Body() createPaymentDto: CreatePaymentDto) {
        const payment = await this.paymentsService.create(createPaymentDto)

        return new PaymentDto(payment)
    }

    @Get()
    async findAll(@FindQuery() findOption: FindOption, @Query() query: QueryDto) {
        const payments = await this.paymentsService.findAll(findOption, query)

        const items = payments.items.map((payment) => new PaymentDto(payment))

        return { ...payments, items }
    }

    @Get(':id')
    async findById(@Param('id') id: EntityId) {
        const payment = await this.paymentsService.findById(id)

        return new PaymentDto(payment)
    }

    @Patch(':id')
    async update(@Param('id') id: EntityId, @Body() updatePaymentDto: UpdatePaymentDto) {
        const payment = await this.paymentsService.update(id, updatePaymentDto)

        return new PaymentDto(payment)
    }

    @Delete(':id')
    async remove(@Param('id') id: EntityId) {
        return this.paymentsService.remove(id)
    }
}
