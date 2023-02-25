import { Injectable } from '@nestjs/common'
import { SystemException, generateUUID } from 'src/common'
import { UserRole } from 'src/users/domain'

type Seconds = number
type RefreshToken = string

// TODO userId: string => userId: UserID
type UserId = string

interface AccessInfo {
    userId: string
    role: UserRole
}

interface TokenValue {
    accessInfo: AccessInfo
    handle: NodeJS.Timeout
}

@Injectable()
export class TokenRepository {
    private tokens: Map<RefreshToken, TokenValue>
    private users: Map<UserId, RefreshToken>

    constructor() {
        this.tokens = new Map<RefreshToken, TokenValue>()
        this.users = new Map<UserId, RefreshToken>()
    }

    onModuleDestroy() {
        this.tokens.forEach((value) => {
            clearTimeout(value.handle)
        })
    }

    async generateKey() {
        let newKey = generateUUID()

        const tryCount = 5

        for (let i = 0; i < tryCount; i++) {
            newKey = generateUUID()
        }

        if (await this.tokens.get(newKey)) {
            throw new SystemException(`can't generate a new key`)
        }

        return newKey
    }

    async set(userId: UserId, refreshToken: RefreshToken, accessInfo: AccessInfo, ttl: Seconds) {
        this.deleteByUserId(userId)

        const handle = setTimeout(() => {
            this.deleteByUserId(userId)
        }, ttl * 1000)

        this.tokens.set(refreshToken, { accessInfo, handle })
        this.users.set(userId, refreshToken)
    }

    async hasUserId(userId: UserId) {
        return this.users.has(userId)
    }

    async deleteByUserId(userId: UserId) {
        const refreshToken = this.users.get(userId)

        if (refreshToken) {
            const value = this.tokens.get(refreshToken)

            if (!value) new SystemException('refreshToken이 없으면 안 된다.')

            clearTimeout(value.handle)
            this.tokens.delete(refreshToken)

            this.users.delete(userId)

            return true
        }

        return false
    }

    async getByRefreshToken(refreshToken: string): Promise<AccessInfo | undefined> {
        const found = this.tokens.get(refreshToken)

        return found ? found.accessInfo : undefined
    }
}
