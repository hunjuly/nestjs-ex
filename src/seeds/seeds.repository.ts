import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { Seed } from './entities'

@Injectable()
export class SeedsRepository extends Repository<Seed> {}
