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

    /*
curl --location --request POST 'http://localhost:3000/users' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "test@test.com",
    "password": "testpassword",
    "birthdate": "1990-01-01",
    "username": "testUser",
    "firstName": "testFirstName",
    "lastName": "testLastName"
}'

curl -X POST http://localhost:3000/auth/login -d '{"email": "test@test.com", "password": "testpassword"}' -H "Content-Type: application/json"

curl http://localhost:3000/auth/profile -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc3OGM3NmM0LTRlZDgtNDhmZS1hZjlhLTkyZjAyOGVkYjVkZiIsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsImJpcnRoZGF0ZSI6IjE5OTAtMDEtMDFUMDA6MDA6MDAuMDAwWiIsInVzZXJuYW1lIjoidGVzdFVzZXIiLCJpYXQiOjE2Nzc3Nzg3NzEsImV4cCI6MTY3Nzc3ODgzMX0.bU-PTHYki7WqxTzCHg6mcd4h7Y_4V_r8bL5eADWY7aE"

*/

    // describe('login', () => {
    //     it('should return an access token with a valid login', async () => {
    //         const user = { email: 'test@example.com', password: 'password' }
    //         const testUser = {
    //             id: '123',
    //             email: 'user@mail.com',
    //             username: 'testuser',
    //             firstName: 'Test',
    //             lastName: 'User',
    //             birthdate: new Date(),
    //             password: 'password'
    //         }

    //         jest.spyOn(usersService, 'findByEmail').mockResolvedValueOnce(testUser)
    //         jest.spyOn(usersService, 'validateUser').mockResolvedValueOnce(true)

    //         const result = await controller.login(user)

    //         expect(result).toHaveProperty('accessToken')
    //     })
    // })
})
