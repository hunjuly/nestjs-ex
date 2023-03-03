import * as jwt from 'jsonwebtoken'
import { UnauthorizedException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { JwtConfigService } from 'src/config'
import { GlobalModule } from 'src/global'
import { AuthModule } from '../auth.module'
import { AuthService } from '../auth.service'

describe('AuthController (e2e)', () => {
    let authService: AuthService
    let config: JwtConfigService

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [GlobalModule, AuthModule]
        }).compile()

        authService = module.get(AuthService)
        config = module.get(JwtConfigService)
    })

    it('throws an UnauthorizedException when userId is missing from the token payload', async () => {
        const invalidToken = jwt.sign({}, config.refreshSecret, { expiresIn: '15m' })

        await expect(authService.refreshTokens(invalidToken)).rejects.toThrow(UnauthorizedException)
    })

    it('throws an UnauthorizedException when userId is invalid from the token payload', async () => {
        const invalidToken = jwt.sign({ userId: 'invalid' }, config.refreshSecret, { expiresIn: '15m' })

        await expect(authService.refreshTokens(invalidToken)).rejects.toThrow(UnauthorizedException)
    })
})
