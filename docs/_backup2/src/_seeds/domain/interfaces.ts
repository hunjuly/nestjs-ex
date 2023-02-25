import { IDomainRepository } from 'src/common/domain'
import { Seed } from './seed'

export interface ISeedsRepository extends IDomainRepository<Seed> {
    findByName(name: string): Promise<Seed | null>
}
