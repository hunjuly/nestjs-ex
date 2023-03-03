import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { GlobalModule } from './global'
import { UsersModule } from './users'

@Module({
    imports: [UsersModule, AuthModule, GlobalModule],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
