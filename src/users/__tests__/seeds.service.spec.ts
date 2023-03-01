import { Test, TestingModule } from '@nestjs/testing'
import { CreateUserDto, UpdateUserDto, UserDto } from '../dto'
import { User } from '../entities'
import { UsersRepository } from '../users.repository'
import { UsersService } from '../users.service'

describe('UsersService', () => {
    let service: UsersService
    let repository: UsersRepository

    const testUser = new User('123', 'testUser', true)
    const testUserDto: UserDto = { id: '123', name: 'testUser' }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: UsersRepository,
                    useValue: {
                        create: jest.fn().mockResolvedValue(testUser),
                        findAll: jest.fn().mockResolvedValue([testUser]),
                        findById: jest.fn().mockResolvedValue(testUser),
                        remove: jest.fn(),
                        save: jest.fn().mockResolvedValue(testUser)
                    }
                }
            ]
        }).compile()

        service = module.get<UsersService>(UsersService)
        repository = module.get<UsersRepository>(UsersRepository)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    describe('create', () => {
        const createUserDto: CreateUserDto = {
            name: 'testUser'
        }

        it('should create a new user', async () => {
            const result = await service.create(createUserDto)
            expect(result).toEqual(testUserDto)
        })
    })

    describe('findAll', () => {
        it('should return all users', async () => {
            const result = await service.findAll()
            expect(result).toEqual([testUserDto])
        })
    })

    describe('findById', () => {
        const id = '123'

        it('should return a user by id', async () => {
            const result = await service.findById(id)
            expect(result).toEqual(testUserDto)
        })

        it('should throw an error if the user is not found', async () => {
            jest.spyOn(repository, 'findById').mockResolvedValue(undefined)
            await expect(service.findById(id)).rejects.toThrow(`User with ID ${id} not found`)
        })
    })

    describe('update', () => {
        const id = '123'
        const updateUserDto: UpdateUserDto = {
            name: 'updatedTestUser'
        }

        it('should update a user by id', async () => {
            const result = await service.update(id, updateUserDto)

            expect(result).toEqual({ id: '123', name: 'updatedTestUser' })
        })

        it('should throw an error if the user is not found', async () => {
            jest.spyOn(repository, 'findById').mockResolvedValue(undefined)
            await expect(service.update(id, updateUserDto)).rejects.toThrow(`User with ID ${id} not found`)
        })
    })

    describe('remove', () => {
        const id = '123'

        it('should remove a user by id', async () => {
            await service.remove(id)
            expect(repository.remove).toHaveBeenCalledWith(testUser)
        })

        it('should throw an error if the user is not found', async () => {
            jest.spyOn(repository, 'findById').mockResolvedValue(undefined)
            await expect(service.remove(id)).rejects.toThrow(`User with ID ${id} not found`)
        })
    })
})
