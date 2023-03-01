import { Test, TestingModule } from '@nestjs/testing'
import { UserDto } from '../dto'
import { CreateUserDto } from '../dto/create-user.dto'
import { UpdateUserDto } from '../dto/update-user.dto'
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

    describe('create', () => {
        it('should create a new user', async () => {
            const createUserDto: CreateUserDto = {
                name: 'test user'
            }
            const expectedUser: UserDto = {
                id: '123',
                name: 'test user'
            }
            jest.spyOn(service, 'create').mockResolvedValue(expectedUser)

            const result = await controller.create(createUserDto)

            expect(result).toBe(expectedUser)
            expect(service.create).toHaveBeenCalledWith(createUserDto)
        })
    })

    describe('findAll', () => {
        it('should return an array of users', async () => {
            const expectedUsers: UserDto[] = [
                { id: '123', name: 'user 1' },
                { id: '456', name: 'user 2' }
            ]
            jest.spyOn(service, 'findAll').mockResolvedValue(expectedUsers)

            const result = await controller.findAll()

            expect(result).toBe(expectedUsers)
            expect(service.findAll).toHaveBeenCalled()
        })
    })

    describe('findById', () => {
        it('should return a user by ID', async () => {
            const expectedUser: UserDto = {
                id: '123',
                name: 'test user'
            }
            jest.spyOn(service, 'findById').mockResolvedValue(expectedUser)

            const result = await controller.findById('123')

            expect(result).toBe(expectedUser)
            expect(service.findById).toHaveBeenCalledWith('123')
        })
    })

    describe('update', () => {
        it('should update a user by ID', async () => {
            const updateUserDto: UpdateUserDto = {
                name: 'updated user'
            }
            const expectedUser: UserDto = {
                id: '123',
                name: 'updated user'
            }
            jest.spyOn(service, 'update').mockResolvedValue(expectedUser)

            const result = await controller.update('123', updateUserDto)

            expect(result).toBe(expectedUser)
            expect(service.update).toHaveBeenCalledWith('123', updateUserDto)
        })
    })

    describe('remove', () => {
        it('should remove a user', async () => {
            const id = '123'

            jest.spyOn(service, 'remove').mockResolvedValue(undefined)

            const response = await controller.remove(id)

            expect(response).toBeUndefined()
            expect(service.remove).toHaveBeenCalledWith(id)
        })
    })
})
