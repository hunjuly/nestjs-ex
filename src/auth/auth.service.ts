import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User, UsersService } from 'src/users'

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

    async validateUser(email: string, password: string): Promise<User> {
        const user = await this.usersService.findByEmail(email)

        const valid = await this.usersService.validateUser(user, password)

        if (!valid) {
            throw new UnauthorizedException('Invalid credentials')
        }

        return user
    }

    async login(user: User) {
        const payload = { sub: user.id, username: user.username }
        return {
            accessToken: this.jwtService.sign(payload),
            refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' })
        }
    }
}
