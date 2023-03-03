import { plainToInstance } from 'class-transformer'
import { Seed } from '../entities'

describe('Seed entity', () => {
    describe('info', () => {
        it('should return the id and name of the seed', () => {
            const seed: Seed = plainToInstance(Seed, { id: '123', name: 'Test Seed' })

            expect(seed.info()).toBe('123 Test Seed')
        })
    })
})
