import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthRecord } from './auth.record'
import { AuthsController } from './auths.controller'
import { AuthsService } from './auths.service'
import { jwtConstants } from './constants'
import { JwtStrategy } from './strategies/jwt.strategy'
import { LocalStrategy } from './strategies/local.strategy'
import { TokenRepository } from './token.repository'

@Module({
    imports: [
        TypeOrmModule.forFeature([AuthRecord]),
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '60s' }
        })
    ],
    providers: [AuthsService, LocalStrategy, TokenRepository, JwtStrategy],
    controllers: [AuthsController],
    exports: [AuthsService]
})
export class AuthsModule {}
