import * as jwt from 'jsonwebtoken'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { v4 as uuidv4 } from 'uuid'
import { convertTimeToSeconds } from 'src/common'
import { JwtConfigService } from 'src/config'
import { RedisService } from 'src/global'
import { User, UsersService } from 'src/users'
import { JwtPayload, TokenPayload } from './interfaces'

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly config: JwtConfigService,
        private readonly redis: RedisService
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

    private generateTokens({ userId, email }: TokenPayload) {
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

    // login을 했다는 것은 validateUser를 통과했다는 말
    async login(user: User) {
        const { id: userId, email } = user

        const tokenPayload = { userId, email }

        const tokenPair = this.generateTokens(tokenPayload)

        await this.storeRefreshToken(userId, tokenPair.refreshToken)

        return tokenPair
    }

    async refreshTokens(refreshToken: string) {
        try {
            const decoded = jwt.verify(refreshToken, this.config.refreshSecret) as JwtPayload

            const { userId } = decoded

            if (!userId) {
                throw new UnauthorizedException()
            }

            const refreshTokenFromStore = await this.getRefreshToken(userId)

            if (refreshTokenFromStore !== refreshToken) {
                throw new UnauthorizedException()
            }

            const tokenPair = this.generateTokens(decoded)

            await this.storeRefreshToken(userId, tokenPair.refreshToken)

            return tokenPair
        } catch (error) {
            throw new UnauthorizedException()
        }
    }

    private async storeRefreshToken(userId: string, refreshToken: string) {
        const expireTime = convertTimeToSeconds(this.config.refreshTokenExpiration)

        await this.redis.set(`refreshToken:${userId}`, refreshToken, expireTime)
    }

    private async getRefreshToken(userId: string): Promise<string> {
        return await this.redis.get(`refreshToken:${userId}`)
    }
}
