import { generateUUID, sleep, updateIntersection } from '../utils'

describe('common/utils', () => {
    describe('sleep', () => {
        it('should wait for the given time', async () => {
            const start = Date.now()
            const timeout = 1000

            await sleep(timeout)

            const end = Date.now()
            const elapsed = end - start

            expect(elapsed).toBeGreaterThanOrEqual(timeout)
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
})
