import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SeedRecord } from './records/seed.record'
import { SeedsController } from './seeds.controller'
import { SeedsRepository } from './seeds.repository'
import { SeedsService } from './seeds.service'

@Module({
    imports: [TypeOrmModule.forFeature([SeedRecord])],
    controllers: [SeedsController],
    providers: [SeedsService, SeedsRepository]
})
export class SeedsModule {}
