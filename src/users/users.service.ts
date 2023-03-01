import { Injectable } from '@nestjs/common'
import { Expect, updateIntersection } from 'src/common'
import { CreateUserDto, UpdateUserDto, UserDto } from './dto'
import { UsersRepository } from './users.repository'

@Injectable()
export class UsersService {
    constructor(private usersRepository: UsersRepository) {}

    async create(createUserDto: CreateUserDto): Promise<UserDto> {
        const user = await this.usersRepository.create(createUserDto)

        return new UserDto(user)
    }

    async findAll() {
        const users = await this.usersRepository.findAll()

        return users.map((user) => new UserDto(user))
    }

    async findById(id: string) {
        const user = await this.usersRepository.findById(id)

        Expect.found(user, `User with ID ${id} not found`)

        return new UserDto(user)
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        const user = await this.usersRepository.findById(id)

        Expect.found(user, `User with ID ${id} not found`)

        const updatedUser = updateIntersection(user, updateUserDto)

        const savedUser = await this.usersRepository.save(updatedUser)

        return new UserDto(savedUser)
    }

    async remove(id: string) {
        const user = await this.usersRepository.findById(id)

        Expect.found(user, `User with ID ${id} not found`)

        await this.usersRepository.remove(user)
    }
}
