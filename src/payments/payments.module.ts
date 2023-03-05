import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Payment } from './entities'
import { PaymentsController } from './payments.controller'
import { PaymentsRepository } from './payments.repository'
import { PaymentsService } from './payments.service'

@Module({
    imports: [TypeOrmModule.forFeature([Payment])],
    controllers: [PaymentsController],
    providers: [PaymentsService, PaymentsRepository]
})
export class PaymentsModule {}
