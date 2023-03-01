import { User } from '../entities'

describe('User', () => {
    it('should create user instance', () => {
        const id = 'testId'
        const name = 'testName'
        const user = new User(id, name)

        expect(user.id).toBe(id)
        expect(user.name).toBe(name)
        expect(user.isGerminated).toBeFalsy()
    })

    it('should germinate user', () => {
        const id = 'testId'
        const name = 'testName'
        const user = new User(id, name)

        user.water()

        expect(user.isGerminated).toBeTruthy()
    })

    it('should give sunlight to germinated user', () => {
        const id = 'testId'
        const name = 'testName'
        const user = new User(id, name)

        user.water()

        expect(() => user.giveSunlight()).not.toThrow()
    })

    it('should not give sunlight to non-germinated user', () => {
        const id = 'testId'
        const name = 'testName'
        const user = new User(id, name)

        expect(() => user.giveSunlight()).toThrow('User has not germinated yet')
    })

    it('should not water germinated user', () => {
        const id = 'testId'
        const name = 'testName'
        const user = new User(id, name)

        user.water()

        expect(() => user.water()).toThrow('Already germinated')
    })
})
