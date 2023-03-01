import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CommonModule, HashService } from 'src/common'
import { User } from './entities'
import { UsersController } from './users.controller'
import { UsersRepository } from './users.repository'
import { UsersService } from './users.service'

@Module({
    imports: [TypeOrmModule.forFeature([User]), CommonModule],
    controllers: [UsersController],
    providers: [UsersService, UsersRepository, HashService],
    exports: [UsersService]
})
export class UsersModule {}
