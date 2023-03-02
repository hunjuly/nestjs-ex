import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User, UsersService } from 'src/users'

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

    async login(user: any) {
        console.log('login', user)
        // const payload = { username: user.username, sub: user.id }

        const { password, firstName, lastName, ...payload } = user

        return {
            access_token: this.jwtService.sign(payload)
        }
    }
}
