import { Test, TestingModule } from '@nestjs/testing'
import { UsersController } from '../users.controller'
import { UsersService } from '../users.service'

describe('UsersController', () => {
    let controller: UsersController
    let service: UsersService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: UsersService,
                    useValue: {
                        create: jest.fn(),
                        findAll: jest.fn(),
                        findById: jest.fn(),
                        update: jest.fn(),
                        remove: jest.fn()
                    }
                }
            ]
        }).compile()

        controller = module.get<UsersController>(UsersController)
        service = module.get<UsersService>(UsersService)
    })

    it('should create a user', async () => {
        const mockUser = {
            id: '123',
            username: 'testuser',
            firstName: 'Test',
            lastName: 'User',
            birthdate: new Date(),
            password: 'password'
        }
        jest.spyOn(service, 'create').mockResolvedValueOnce(mockUser)

        const result = await controller.create(mockUser)
        expect(result).toEqual(mockUser)
    })

    it('should get all users', async () => {
        const mockUsers = [
            {
                id: '1',
                username: 'testuser1',
                firstName: 'Test',
                lastName: 'User1',
                birthdate: new Date(),
                password: 'password1'
            },
            {
                id: '2',
                username: 'testuser2',
                firstName: 'Test',
                lastName: 'User2',
                birthdate: new Date(),
                password: 'password2'
            }
        ]
        jest.spyOn(service, 'findAll').mockResolvedValueOnce(mockUsers)

        const result = await controller.findAll()
        expect(result).toEqual(mockUsers)
    })

    it('should get a user by ID', async () => {
        const mockUser = {
            id: '1',
            username: 'testuser',
            firstName: 'Test',
            lastName: 'User',
            birthdate: new Date(),
            password: 'password'
        }
        jest.spyOn(service, 'findById').mockResolvedValueOnce(mockUser)

        const result = await controller.findById('1')
        expect(result).toEqual(mockUser)
    })

    it('should update a user', async () => {
        const mockUser = {
            id: '1',
            username: 'testuser',
            firstName: 'Test',
            lastName: 'User',
            birthdate: new Date(),
            password: 'password'
        }
        jest.spyOn(service, 'update').mockResolvedValueOnce(mockUser)

        const result = await controller.update('1', mockUser)
        expect(result).toEqual(mockUser)
    })

    it('should delete a user', async () => {
        jest.spyOn(service, 'remove').mockResolvedValueOnce(undefined)

        const result = await controller.remove('1')
        expect(result).toBeUndefined()
    })
})
