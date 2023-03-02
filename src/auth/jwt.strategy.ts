import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { jwtConstants } from './constants'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret
        })
    }

    // id: '0c7f0624-c4d8-48c0-b6b5-c349066b25fe',
    // email: 'test@test.com',
    // birthdate: 1990-01-01T00:00:00.000Z,
    // username: 'testUser',
    async validate(payload: any) {
        return { userId: payload.id, username: payload.username }
    }
}
