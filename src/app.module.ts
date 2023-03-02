import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { DatabaseModule } from './database/'

// import { UsersModule } from './users/users.module'

@Module({
    imports: [
        DatabaseModule,
        // UsersModule,
        // ConfigModule.forRoot({
        //     isGlobal: true,
        //     envFilePath: ['.env']
        // }),
        AuthModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
