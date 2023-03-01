import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { UserDto } from './dto'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        const user = await this.usersService.create(createUserDto)
        return new UserDto(user)
    }

    @Get()
    async findAll() {
        const users = await this.usersService.findAll()

        return users.map((user) => new UserDto(user))
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        const user = await this.usersService.findById(id)
        return new UserDto(user)
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        const user = await this.usersService.update(id, updateUserDto)
        return new UserDto(user)
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.usersService.remove(id)
    }
}
