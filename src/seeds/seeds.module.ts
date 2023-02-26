import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Seed } from './entities/seed.entity'
import { SeedsRepository } from './repositories'
import { SeedsController } from './seeds.controller'
import { SeedsService } from './seeds.service'

@Module({
    imports: [TypeOrmModule.forFeature([Seed])],
    controllers: [SeedsController],
    providers: [SeedsService, SeedsRepository]
})
export class SeedsModule {}

/*
src/
|-- app.module.ts
|-- users/
    |-- users.module.ts
    |-- users.controller.ts
    |-- users.service.ts
    |-- dto/
    |   |-- create-user.dto.ts
    |   |-- update-user.dto.ts
    |   |-- user.dto.ts
    |-- entities/
    |   |-- user.entity.ts
    |-- repositories/
        |-- users.repository.ts
*/
