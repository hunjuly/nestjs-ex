import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CommonModule, HashService } from 'src/common'
import { DatabaseModule } from 'src/database'
import { User } from '../entities'
import { UsersRepository } from '../users.repository'
import { UsersService } from '../users.service'

describe('UsersService', () => {
    let service: UsersService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [TypeOrmModule.forFeature([User]), CommonModule, DatabaseModule],
            providers: [
                UsersService,
                UsersRepository,
                {
                    provide: HashService,
                    useValue: {
                        hashPassword: jest.fn().mockResolvedValue('hashedPassword'),
                        validatePassword: jest.fn().mockResolvedValue(true)
                    }
                }
            ]
        }).compile()

        service = module.get<UsersService>(UsersService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    describe('validateUser', () => {
        const email = 'testuser@example.com'
        const password = 'testpassword'
        const createDto = {
            username: 'test username',
            email,
            password: 'hashedPassword',
            firstName: 'Test',
            lastName: 'User',
            birthdate: new Date('1990-01-01')
        }

        it('should return a user by email', async () => {
            await service.create(createDto)

            const result = await service.findByEmail(email)

            expect(result).toEqual({ ...createDto, id: expect.any(String) })
        })

        it('should return a user when email and password are valid', async () => {
            await service.create(createDto)

            const valid = await service.validateUser(password, 'hashedPassword')

            expect(valid).toBeTruthy()
        })
    })
})
