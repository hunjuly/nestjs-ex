import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseRepository } from 'src//common/application'
import { IUsersRepository, User } from './domain'
import { UserRecord } from './records/user.record'

@Injectable()
export class UsersRepository extends BaseRepository<UserRecord, User> implements IUsersRepository {
    constructor(@InjectRepository(UserRecord) typeorm: Repository<UserRecord>) {
        super(typeorm)
    }

    protected recordToEntity(record: UserRecord): User {
        return new User(
            this,
            record.id,
            record.email,
            record.username,
            record.role,
            record.createDate,
            record.updateDate
        )
    }

    protected entityToRecord(entity: Partial<User>): Partial<UserRecord> {
        const record = new UserRecord()
        record.id = entity.id
        record.email = entity.email
        record.username = entity.username
        record.role = entity.role
        record.createDate = entity.createDate
        record.updateDate = entity.updateDate

        return record
    }

    async findByEmail(email: string): Promise<User | null> {
        const record = await this.typeorm.findOneBy({ email })

        if (record) {
            return this.recordToEntity(record)
        }

        return null
    }
}
