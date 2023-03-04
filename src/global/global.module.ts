import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from 'src/database/'

@Module({
    imports: [
        DatabaseModule,
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
            envFilePath: ['.env']
        })
    ]
})
export class GlobalModule {}
