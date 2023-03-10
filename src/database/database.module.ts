import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: ':memory:',
            synchronize: true,
            autoLoadEntities: true
        })
    ],
    exports: [TypeOrmModule]
})
export class DatabaseModule {}
