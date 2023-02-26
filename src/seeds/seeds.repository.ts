import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Seed } from './entities'

@Injectable()
export class SeedsRepository extends Repository<Seed> {
    constructor(
        @InjectRepository(Seed)
        repository: Repository<Seed>
    ) {
        super(repository.target, repository.manager, repository.queryRunner)
    }
}
