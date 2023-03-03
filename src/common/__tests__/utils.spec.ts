import { convertTimeToSeconds, generateUUID, sleep, updateIntersection } from '../utils'

describe('common/utils', () => {
    describe('sleep', () => {
        it('should wait for the given time', async () => {
            const start = Date.now()
            const timeout = 1000

            await sleep(timeout)

            const end = Date.now()
            const elapsed = end - start

            // timeout을 1000으로 설정했다면 1000 전후에 실행되기 때문에 90% 범위로 설정했다.
            expect(elapsed).toBeGreaterThanOrEqual(timeout * 0.9)
        })
    })

    describe('generateUUID', () => {
        it('should generate a UUID with the correct format', () => {
            const uuid = generateUUID()
            const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/

            expect(uuid).toMatch(regex)
        })

        it('should generate a different UUID every time', () => {
            const uuid1 = generateUUID()
            const uuid2 = generateUUID()

            expect(uuid1).not.toEqual(uuid2)
        })

        it('handles browsers without support for performance', () => {
            ;(global as any).performance = undefined

            const uuid1 = generateUUID()

            delete (global as any).performance

            expect(uuid1).toBeDefined()
        })
    })

    describe('updateIntersection', () => {
        it('should update the intersection of two objects', () => {
            const obj1 = { name: 'Alice', age: 30, address: '123 Main St' }
            const obj2 = { name: 'Bob', age: 25, phone: '555-5555' }
            const result = updateIntersection(obj1, obj2)

            expect(result).toEqual({ name: 'Bob', age: 25, address: '123 Main St' })
        })

        it('should return the first object if there is no intersection', () => {
            const obj1 = { name: 'Alice', age: 30 }
            const obj2 = { phone: '555-5555', email: 'alice@example.com' }
            const result = updateIntersection(obj1, obj2)

            expect(result).toEqual(obj1)
        })
    })

    describe('convertTimeToSeconds', () => {
        it('should convert 1d to 86400 seconds', () => {
            const result = convertTimeToSeconds('1d')
            expect(result).toBe(86400)
        })

        it('should convert 2h to 7200 seconds', () => {
            const result = convertTimeToSeconds('2h')
            expect(result).toBe(7200)
        })

        it('should convert 30m to 1800 seconds', () => {
            const result = convertTimeToSeconds('30m')
            expect(result).toBe(1800)
        })

        it('should convert 45s to 45 seconds', () => {
            const result = convertTimeToSeconds('45s')
            expect(result).toBe(45)
        })

        it('should convert 1d 2h to 93600 seconds', () => {
            const result = convertTimeToSeconds('1d 2h')
            expect(result).toBe(93600)
        })

        it('should throw an error if the input is invalid', () => {
            expect(() => convertTimeToSeconds('invalid')).toThrowError('Invalid time string')
        })
    })
})
