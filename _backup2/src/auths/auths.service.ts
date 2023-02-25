import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { Repository } from 'typeorm'
import { SystemException } from 'src/common'
import { config } from 'src/config'
import { UserRole } from 'src/users/domain'
import { AuthRecord } from './auth.record'
import { TokenRepository } from './token.repository'

export class CreateAuthDto {
    userId: string
    email: string
    role: UserRole
    password: string
}

@Injectable()
export class AuthsService {
    constructor(
        @InjectRepository(AuthRecord)
        private typeorm: Repository<AuthRecord>, // AuthsRepository로 랩해라
        private tokens: TokenRepository,
        private jwtService: JwtService
    ) {}

    async login(userId: string, role: UserRole) {
        const accessInfo = { userId, role }

        const refreshToken = await this.tokens.generateKey()

        await this.tokens.set(userId, refreshToken, accessInfo, config.RefreshTokenExpiredTime)

        const updateTime = new Date()
        const payload = { ...accessInfo, updateTime }
        const accessToken = this.jwtService.sign(payload)

        return { refreshToken, accessToken }
    }

    async refresh(refreshToken: string) {
        const value = await this.tokens.getByRefreshToken(refreshToken)

        if (!value) throw new UnauthorizedException()

        const updateTime = new Date()
        const payload = { ...value, updateTime }

        const accessToken = this.jwtService.sign(payload)

        return { accessToken }
    }

    async logout(userId: string) {
        const success = await this.tokens.deleteByUserId(userId)

        if (!success) throw new UnauthorizedException()
    }

    async remove(userId: string) {
        if (await this.tokens.hasUserId(userId)) {
            await this.logout(userId)
        }

        const res = await this.typeorm.delete(userId)

        return res.affected === 1
    }

    async create(dto: CreateAuthDto) {
        const user = await this.findByEmail(dto.email)

        if (user) throw new SystemException('already exists authentication')

        // 7을 선택한 이유는 없다. 적당히 골랐다.
        const saltOrRounds = 7
        const hash = await bcrypt.hash(dto.password, saltOrRounds)

        const candidate = new AuthRecord()
        candidate.userId = dto.userId
        candidate.email = dto.email
        candidate.role = dto.role
        candidate.passwordHash = hash

        const newUser = await this.typeorm.save(candidate)

        return {
            email: newUser.email,
            userId: newUser.userId
        }
    }

    async validate(userId: string, password: string) {
        const auth = await this.typeorm.findOneBy({ userId })

        if (!auth) return false

        return bcrypt.compare(password, auth.passwordHash)
    }

    async findByUserId(userId: string): Promise<AuthRecord | null> {
        const auth = await this.typeorm.findOneBy({ userId })

        return auth
    }

    async findByEmail(email: string): Promise<AuthRecord | null> {
        const auth = await this.typeorm.findOneBy({ email })

        return auth
    }
}
