import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { JwtConfigService } from 'src/config'
import { UsersService } from 'src/users'
import { JwtPayload } from '../interfaces'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private usersService: UsersService, config: JwtConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.accessSecret
        })
    }

    async validate(payload: JwtPayload) {
        const { userId, email } = payload

        await this.usersService.findById(userId)

        return { userId, email }
    }
}
