import { Body, Controller, Delete, Get, Param, Patch, Post, UseFilters, UseGuards } from '@nestjs/common'
import {
    DomainExceptionFilter,
    OrderOption,
    OrderQuery,
    PageOption,
    PageQuery
} from 'src//common/application'
import { AdminGuard, JwtAuthGuard, SelfGuard } from 'src/auths'
import { CreateUserDto, UpdateUserDto } from './dto'
import { UsersService } from './users.service'

@UseFilters(DomainExceptionFilter)
@Controller('users')
export class UsersController {
    constructor(private readonly service: UsersService) {}

    @Post()
    create(@Body() createDto: CreateUserDto) {
        return this.service.create(createDto)
    }

    @Get()
    @UseGuards(JwtAuthGuard, AdminGuard)
    find(@PageQuery() page: PageOption, @OrderQuery() order?: OrderOption) {
        return this.service.find(page, order)
    }

    @Get(':userId')
    @UseGuards(JwtAuthGuard, SelfGuard)
    findById(@Param('userId') id: string) {
        return this.service.findById(id)
    }

    @Patch(':userId')
    @UseGuards(JwtAuthGuard, SelfGuard)
    update(@Param('userId') id: string, @Body() updateDto: UpdateUserDto) {
        return this.service.update(id, updateDto)
    }

    @Delete(':userId')
    @UseGuards(JwtAuthGuard, SelfGuard)
    remove(@Param('userId') id: string) {
        return this.service.remove(id)
    }
}
