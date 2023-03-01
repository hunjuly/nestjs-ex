import { Injectable } from '@nestjs/common'
import { Expect, HashService, updateIntersection } from 'src/common'
import { CreateUserDto, UpdateUserDto } from './dto'
import { User } from './entities'
import { UsersRepository } from './users.repository'

@Injectable()
export class UsersService {
    constructor(private usersRepository: UsersRepository, private readonly hashService: HashService) {}

    async create(createUserDto: CreateUserDto) {
        const { password } = createUserDto
        const hashedPassword = await this.hashService.hashPassword(password)
        const createUser = {
            ...createUserDto,
            password: hashedPassword
        }
        const user = await this.usersRepository.create(createUser)

        return user
    }

    async findAll() {
        const users = await this.usersRepository.findAll()

        return users
    }

    async findById(id: string) {
        const user = await this.usersRepository.findById(id)

        Expect.found(user, `User with ID ${id} not found`)

        return user
    }

    async findByEmail(email: string) {
        const user = await this.usersRepository.findByEmail(email)

        Expect.found(user, `User with email ${email} not found`)

        return user
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        const user = await this.usersRepository.findById(id)

        Expect.found(user, `User with ID ${id} not found`)

        const updatedUser = updateIntersection(user, updateUserDto)

        const savedUser = await this.usersRepository.save(updatedUser)

        return savedUser
    }

    async remove(id: string) {
        const user = await this.usersRepository.findById(id)

        Expect.found(user, `User with ID ${id} not found`)

        await this.usersRepository.remove(user)
    }

    async validateUser(user: User, password: string) {
        return this.hashService.validatePassword(password, user.password)
    }
}
