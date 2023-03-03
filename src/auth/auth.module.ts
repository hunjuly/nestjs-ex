import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { JwtConfigService } from 'src/config'
import { RedisService } from 'src/global'
import { UsersModule } from '../users/users.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtStrategy } from './strategies/jwt.strategy'
import { LocalStrategy } from './strategies/local.strategy'

@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.registerAsync({
            useFactory: async (config: JwtConfigService) => ({
                secret: config.accessSecret,
                signOptions: {
                    expiresIn: config.accessTokenExpiration
                }
            }),
            inject: [ConfigService]
        }),
        JwtModule.registerAsync({
            useFactory: async (config: JwtConfigService) => ({
                secret: config.refreshSecret,
                signOptions: {
                    expiresIn: config.refreshTokenExpiration
                }
            }),
            inject: [ConfigService]
        })
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy, JwtConfigService, RedisService],
    controllers: [AuthController]
})
export class AuthModule {}
