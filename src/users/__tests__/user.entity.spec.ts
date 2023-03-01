import { plainToClass } from 'class-transformer'
import { User } from '../entities'

describe('User entity', () => {
    it('should exclude password from serialization', () => {
        const user = plainToClass(User, {
            id: '1',
            name: 'John',
            password: 'secret'
        })
        expect(user.password).toBeUndefined()
        expect(JSON.stringify(user)).not.toContain('password')
    })

    it('should include birthdate in serialization', () => {
        const user = plainToClass(User, {
            id: '1',
            name: 'John',
            birthdate: new Date('1990-01-01')
        })
        expect(user.birthdate).toBeInstanceOf(Date)
        expect(user.birthdate.getFullYear()).toEqual(1990)
        expect(JSON.stringify(user)).toContain('birthdate')
    })
})
