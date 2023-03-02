import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { UsersModule } from '../users/users.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { jwtConstants } from './constants'
import { JwtStrategy, LocalStrategy } from './strategies'

@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.registerAsync({
            useFactory: () => ({
                secret: jwtConstants.accessSecret,
                signOptions: {
                    expiresIn: jwtConstants.accessTokenExpiration
                }
            })
        }),
        JwtModule.registerAsync({
            useFactory: () => ({
                secret: jwtConstants.refreshSecret,
                signOptions: {
                    expiresIn: jwtConstants.refreshTokenExpiration
                }
            })
        })
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy],
    controllers: [AuthController]
})
export class AuthModule {}
