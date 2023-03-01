import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './entities'

@Injectable()
export class UsersRepository {
    constructor(
        @InjectRepository(User)
        private readonly repository: Repository<User>
    ) {}

    async findAll(): Promise<User[]> {
        return this.repository.find()
    }

    async findById(id: string): Promise<User> {
        return this.repository.findOneBy({ id })
    }

    async findByEmail(email: string): Promise<User> {
        return this.repository.findOneBy({ email })
    }

    async create(newUser: Partial<User>): Promise<User> {
        return this.repository.save(newUser)
    }

    async save(user: User): Promise<User> {
        return this.repository.save(user)
    }

    async remove(user: User): Promise<void> {
        await this.repository.remove(user)
    }
}
