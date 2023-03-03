import { Test, TestingModule } from '@nestjs/testing'
import { RedisService } from '../redis.service'

describe('RedisService', () => {
    let service: RedisService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RedisService]
        }).compile()

        service = module.get<RedisService>(RedisService)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('set', () => {
        it('should delete the key and value when the time expires', async () => {
            jest.useFakeTimers()
            const key = 'test'
            const value = 'test_value'
            const expireSeconds = 1
            await service.set(key, value, expireSeconds)
            expect(service['values'].has(key)).toBeTruthy()
            expect(service['handles'].has(key)).toBeTruthy()
            jest.advanceTimersByTime(expireSeconds * 1000)
            expect(service['values'].has(key)).toBeFalsy()
            expect(service['handles'].has(key)).toBeFalsy()
        })

        it('should update the expiration time when the same key is set again', async () => {
            jest.useFakeTimers()
            const key = 'test'
            const value1 = 'test_value1'
            const value2 = 'test_value2'
            const expireSeconds = 5
            await service.set(key, value1, expireSeconds)
            const handle1 = service['handles'].get(key)
            await service.set(key, value2, expireSeconds)
            const handle2 = service['handles'].get(key)
            expect(handle1).not.toBe(handle2)
            jest.advanceTimersByTime(expireSeconds * 1000)
            expect(service['values'].has(key)).toBeFalsy()
            expect(service['handles'].has(key)).toBeFalsy()
        })
    })

    describe('get', () => {
        it('should return the value of the key', async () => {
            const key = 'test'
            const value = 'test_value'
            await service.set(key, value, 10)
            const result = await service.get(key)
            expect(result).toBe(value)
        })

        it('should return undefined when the key does not exist', async () => {
            const key = 'test'
            const result = await service.get(key)
            expect(result).toBeUndefined()
        })
    })

    describe('delete', () => {
        it('should delete the key and value', async () => {
            const key = 'test'
            const value = 'test_value'
            await service.set(key, value, 10)
            await service.delete(key)
            const result = await service.get(key)
            expect(result).toBeUndefined()
        })
    })
})
