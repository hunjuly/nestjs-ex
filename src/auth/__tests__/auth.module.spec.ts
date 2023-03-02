import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { Test, TestingModule } from '@nestjs/testing'
import { UsersService } from 'src/users/'
import { AuthController } from '../auth.controller'
import { AuthService } from '../auth.service'

describe('AuthController', () => {
    let controller: AuthController
    let authService: AuthService
    let usersService: UsersService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                PassportModule,
                JwtModule.register({
                    secret: 'test-secret',
                    signOptions: { expiresIn: '60s' }
                })
            ],
            controllers: [AuthController],
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: {
                        findByEmail: jest.fn(),
                        validateUser: jest.fn()
                    }
                }
            ]
        }).compile()

        controller = module.get(AuthController)
        authService = module.get(AuthService)
        usersService = module.get(UsersService)
    })
})
