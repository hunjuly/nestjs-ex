import { Injectable } from '@nestjs/common'
import { compare, hash } from 'bcrypt'

@Injectable()
export class HashService {
    async hashPassword(password: string): Promise<string> {
        const saltRounds = 10
        const hashedPassword = await hash(password, saltRounds)
        return hashedPassword
    }

    async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return compare(plainPassword, hashedPassword)
    }
}
