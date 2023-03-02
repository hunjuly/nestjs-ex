// import { Injectable } from '@nestjs/common'
// import { PassportStrategy } from '@nestjs/passport'
// import { ExtractJwt, Strategy } from 'passport-jwt'
// import { jwtConstants } from './constants'
// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//     constructor() {
//         super({
//             jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//             ignoreExpiration: false,
//             secretOrKey: jwtConstants.accessSecret
//         })
//     }
//     async validate(payload: any) {
//         return { userId: payload.sub, username: payload.username }
//     }
// }
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UsersService } from '../users/users.service'
import { jwtConstants } from './constants'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.accessSecret
        })
    }

    async validate(payload: any) {
        const { id, email } = payload

        const user = await this.usersService.findById(id)

        if (!user) {
            throw new UnauthorizedException('Invalid token')
        }

        return { id, email }
    }
}
