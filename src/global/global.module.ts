import { Module, ValidationPipe } from '@nestjs/common'
import { APP_PIPE } from '@nestjs/core'
import { ConfigModule } from 'src/config'
import { DatabaseModule } from 'src/database/'

@Module({
    imports: [DatabaseModule, ConfigModule],
    providers: [
        {
            provide: APP_PIPE,
            useClass: ValidationPipe
        }
    ]
})
export class GlobalModule {}
