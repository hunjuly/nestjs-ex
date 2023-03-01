import { Test } from '@nestjs/testing'
import { HashService } from '../services'

describe('HashService', () => {
    let hashService: HashService

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [HashService]
        }).compile()

        hashService = moduleRef.get<HashService>(HashService)
    })

    describe('hashPassword', () => {
        it('should hash the password', async () => {
            const password = 'password'
            const hashedPassword = await hashService.hashPassword(password)

            expect(hashedPassword).not.toEqual(password)
        })
    })

    describe('validatePassword', () => {
        it('should return true for matching passwords', async () => {
            const password = 'password'
            const hashedPassword = await hashService.hashPassword(password)

            const isValidPassword = await hashService.validatePassword(password, hashedPassword)

            expect(isValidPassword).toBe(true)
        })

        it('should return false for non-matching passwords', async () => {
            const password = 'password'
            const hashedPassword = await hashService.hashPassword(password)

            const isValidPassword = await hashService.validatePassword('wrongpassword', hashedPassword)

            expect(isValidPassword).toBe(false)
        })
    })
})
