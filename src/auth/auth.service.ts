import * as jwt from 'jsonwebtoken'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { v4 as uuidv4 } from 'uuid'
import { User, UsersService } from 'src/users'
import { jwtConstants } from './constants'

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

    async validateUser(email: string, password: string): Promise<User> {
        const user = await this.usersService.findByEmail(email)

        if (user) {
            const valid = await this.usersService.validateUser(user, password)

            if (valid) {
                return user
            }
        }

        return null
    }

    private generateTokens(payload: any): { access_token: string; refresh_token: string } {
        const accessToken = this.jwtService.sign(payload, {
            secret: jwtConstants.accessSecret,
            expiresIn: jwtConstants.accessTokenExpiration
        })

        const refreshToken = this.jwtService.sign(
            { jti: uuidv4(), ...payload },
            {
                secret: jwtConstants.refreshSecret,
                expiresIn: jwtConstants.refreshTokenExpiration
            }
        )

        return {
            access_token: accessToken,
            refresh_token: refreshToken
        }
    }

    async login(user: any) {
        const { password, firstName, lastName, ...payload } = user

        return this.generateTokens(payload)
    }

    async refreshTokens(refreshToken: string) {
        try {
            const decoded = jwt.verify(refreshToken, jwtConstants.refreshSecret)

            const { iat, exp, jti, ...payload } = decoded as { [key: string]: any }

            return this.generateTokens(payload)
        } catch (error) {
            throw new UnauthorizedException()
        }
    }
}
