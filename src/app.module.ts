import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { DatabaseModule } from './database/'
import { UsersModule } from './users'

@Module({
    imports: [
        DatabaseModule,
        UsersModule,
        AuthModule
        // ConfigModule.forRoot({
        //     isGlobal: true,
        //     envFilePath: ['.env']
        // }),
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
