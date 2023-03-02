import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UsersService } from '../users/users.service'
import { jwtConstants } from './constants'
import { JwtPayload } from './interfaces'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.accessSecret
        })
    }

    async validate(payload: JwtPayload) {
        const { userId, email } = payload

        const user = await this.usersService.findById(userId)

        if (!user) {
            throw new UnauthorizedException('Invalid token')
        }

        return { userId, email }
    }
}
