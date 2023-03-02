import * as jwt from 'jsonwebtoken'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { v4 as uuidv4 } from 'uuid'
import { User, UsersService } from 'src/users'
import { jwtConstants } from './constants'
import { JwtPayload, TokenPair, TokenPayload } from './interfaces'

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

    private generateTokens({ userId, email }: TokenPayload): TokenPair {
        // userId,email 외에 다른 값은 제거한다
        const payload = { userId, email }

        const accessToken = this.jwtService.sign(
            { ...payload, jti: uuidv4() },
            {
                secret: jwtConstants.accessSecret,
                expiresIn: jwtConstants.accessTokenExpiration
            }
        )

        const refreshToken = this.jwtService.sign(
            { ...payload, jti: uuidv4() },
            {
                secret: jwtConstants.refreshSecret,
                expiresIn: jwtConstants.refreshTokenExpiration
            }
        )

        return { accessToken, refreshToken }
    }

    async login(user: User) {
        const { id: userId, email } = user

        return this.generateTokens({ userId, email })
    }

    async refreshTokens(refreshToken: string) {
        try {
            const decoded = jwt.verify(refreshToken, jwtConstants.refreshSecret)

            return this.generateTokens(decoded as JwtPayload)
        } catch (error) {
            throw new UnauthorizedException()
        }
    }
}
