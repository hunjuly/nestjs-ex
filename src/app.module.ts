import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { DatabaseModule } from './database/'
import { SeedsModule } from './seeds'

@Module({
    imports: [SeedsModule, DatabaseModule],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
