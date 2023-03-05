import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { DatabaseModule } from 'src/database'
import { OrdersModule } from '../orders.module'

describe('OrdersModule', () => {
    let app: INestApplication
    let server
    let orderId: string

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [DatabaseModule, OrdersModule]
        }).compile()

        app = module.createNestApplication()
        await app.init()

        server = app.getHttpServer()
    })

    afterAll(async () => {
        await app.close()
    })

    describe('POST /orders', () => {
        it('creates a new order', () => {
            return request(server)
                .post('/orders')
                .send({
                    name: 'Order 1'
                })
                .expect(201)
                .expect((res) => {
                    expect(res.body.id).toBeDefined()
                    expect(res.body.name).toEqual('Order 1')

                    orderId = res.body.id
                })
        })
    })

    describe('/orders (GET)', () => {
        it('returns orders with query options', async () => {
            const queryDto = {
                order: 'name:desc',
                limit: 1,
                offset: 0,
                search: 'Order 1'
            }

            return request(server)
                .get('/orders')
                .query(queryDto)
                .expect(200)
                .expect((res) => {
                    expect(Array.isArray(res.body.items)).toBeTruthy()
                    expect(res.body.items.length).toBe(1)
                    expect(res.body.items[0].name).toBe('Order 1')
                    expect(typeof res.body.offset).toBe('number')
                    expect(typeof res.body.limit).toBe('number')
                    expect(typeof res.body.total).toBe('number')
                })
        })

        it('returns orders with default options', async () => {
            return request(server)
                .get('/orders')
                .expect(200)
                .expect((res) => {
                    expect(Array.isArray(res.body.items)).toBeTruthy()
                    expect(res.body.items.length).toBeGreaterThan(0)
                    expect(typeof res.body.offset).toBe('number')
                    expect(typeof res.body.limit).toBe('number')
                    expect(typeof res.body.total).toBe('number')
                })
        })
    })

    describe('GET /orders/:id', () => {
        it('returns the order with the given id', () => {
            return request(server)
                .get(`/orders/${orderId}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.id).toEqual(orderId)
                    expect(res.body.name).toBeDefined()
                })
        })

        it('returns a 404 error when the order is not found', () => {
            return request(server).get('/orders/999').expect(404)
        })
    })

    describe('PATCH /orders/:id', () => {
        it('updates the order with the given id', () => {
            return request(server)
                .patch(`/orders/${orderId}`)
                .send({
                    name: 'Updated Order'
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body.id).toEqual(orderId)
                    expect(res.body.name).toEqual('Updated Order')
                })
        })

        it('returns a 404 error when the order is not found', () => {
            return request(server)
                .patch('/orders/999')
                .send({
                    name: 'Updated Order'
                })
                .expect(404)
        })
    })

    describe('DELETE /orders/:id', () => {
        it('deletes the order with the given id', () => {
            return request(server).delete(`/orders/${orderId}`).expect(200)
        })

        it('returns a 404 error when the order is not found', () => {
            return request(server).delete('/orders/999').expect(404)
        })
    })
})
