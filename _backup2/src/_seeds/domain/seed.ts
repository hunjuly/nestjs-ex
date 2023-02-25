import { AggregateRoot, AlreadyExistsDomainException } from 'src/common/domain'
import { ISeedsRepository } from './interfaces'
import { CreateSeedCmd, UpdateSeedCmd } from './types'

export class Seed extends AggregateRoot {
    constructor(private repository: ISeedsRepository, id: string, public name: string) {
        super(id)
    }

    static async create(repository: ISeedsRepository, cmd: CreateSeedCmd): Promise<Seed> {
        const found = await repository.findByName(cmd.name)

        if (found) throw new AlreadyExistsDomainException()

        const seed = await repository.create(cmd)

        return seed
    }

    async update(cmd: UpdateSeedCmd): Promise<void> {
        if (cmd.name) {
            const found = await this.repository.findByName(cmd.name)

            if (found) throw new AlreadyExistsDomainException()

            this.name = cmd.name
        }

        await this.repository.update(this.id, cmd)
    }
}
