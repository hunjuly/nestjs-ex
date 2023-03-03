import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { GlobalModule } from './global'
// import { MoviesModule } from './movies'
// import { OrdersModule } from './orders'
// import { PaymentsModule } from './payments'
// import { SchedulesModule } from './schedules'
// import { TheatersModule } from './theaters'
// import { TicketsModule } from './tickets'
import { UsersModule } from './users'

@Module({
    imports: [
        GlobalModule,
        UsersModule,
        AuthModule
        // MoviesModule,
        // OrdersModule,
        // PaymentsModule,
        // SchedulesModule,
        // TheatersModule,
        // TicketsModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
