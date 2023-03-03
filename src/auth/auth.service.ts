import * as jwt from 'jsonwebtoken'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { v4 as uuidv4 } from 'uuid'
import { JwtConfigService } from 'src/config'
import { User, UsersService } from 'src/users'
import { JwtPayload, TokenPair, TokenPayload } from './interfaces'

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly config: JwtConfigService
    ) {}

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
        const accessToken = this.jwtService.sign(
            { userId, email, jti: uuidv4() },
            {
                secret: this.config.accessSecret,
                expiresIn: this.config.accessTokenExpiration
            }
        )

        const refreshToken = this.jwtService.sign(
            { userId, email, jti: uuidv4() },
            {
                secret: this.config.refreshSecret,
                expiresIn: this.config.refreshTokenExpiration
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
            const decoded = jwt.verify(refreshToken, this.config.refreshSecret)

            return this.generateTokens(decoded as JwtPayload)
        } catch (error) {
            throw new UnauthorizedException()
        }
    }
}
