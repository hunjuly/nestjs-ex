import { Seed } from '../entities'

describe('Seed', () => {
    it('should create seed instance', () => {
        const id = 'testId'
        const name = 'testName'
        const seed = new Seed(id, name)

        expect(seed.id).toBe(id)
        expect(seed.name).toBe(name)
        expect(seed.isGerminated).toBeFalsy()
    })

    it('should germinate seed', () => {
        const id = 'testId'
        const name = 'testName'
        const seed = new Seed(id, name)

        seed.water()

        expect(seed.isGerminated).toBeTruthy()
    })

    it('should give sunlight to germinated seed', () => {
        const id = 'testId'
        const name = 'testName'
        const seed = new Seed(id, name)

        seed.water()

        expect(() => seed.giveSunlight()).not.toThrow()
    })

    it('should not give sunlight to non-germinated seed', () => {
        const id = 'testId'
        const name = 'testName'
        const seed = new Seed(id, name)

        expect(() => seed.giveSunlight()).toThrow('Seed has not germinated yet')
    })

    it('should not water germinated seed', () => {
        const id = 'testId'
        const name = 'testName'
        const seed = new Seed(id, name)

        seed.water()

        expect(() => seed.water()).toThrow('Already germinated')
    })
})
