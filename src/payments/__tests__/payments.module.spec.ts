import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { GlobalModule } from 'src/global'
import { PaymentsModule } from '../payments.module'

describe('PaymentsModule', () => {
    let app: INestApplication
    let server
    let paymentId: string

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [GlobalModule, PaymentsModule]
        }).compile()

        app = module.createNestApplication()
        await app.init()

        server = app.getHttpServer()
    })

    afterAll(async () => {
        await app.close()
    })

    describe('POST /payments', () => {
        it('creates a new payment', () => {
            return request(server)
                .post('/payments')
                .send({
                    name: 'Payment 1'
                })
                .expect(201)
                .expect((res) => {
                    expect(res.body.id).toBeDefined()
                    expect(res.body.name).toEqual('Payment 1')

                    paymentId = res.body.id
                })
        })
    })

    describe('/payments (GET)', () => {
        it('returns payments with query options', async () => {
            const queryDto = {
                order: 'name:desc',
                limit: 1,
                offset: 0,
                search: 'Payment 1'
            }

            return request(server)
                .get('/payments')
                .query(queryDto)
                .expect(200)
                .expect((res) => {
                    expect(Array.isArray(res.body.items)).toBeTruthy()
                    expect(res.body.items.length).toBe(1)
                    expect(res.body.items[0].name).toBe('Payment 1')
                    expect(typeof res.body.offset).toBe('number')
                    expect(typeof res.body.limit).toBe('number')
                    expect(typeof res.body.total).toBe('number')
                })
        })

        it('returns payments with default options', async () => {
            return request(server)
                .get('/payments')
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

    describe('GET /payments/:id', () => {
        it('returns the payment with the given id', () => {
            return request(server)
                .get(`/payments/${paymentId}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.id).toEqual(paymentId)
                    expect(res.body.name).toBeDefined()
                })
        })

        it('returns a 404 error when the payment is not found', () => {
            return request(server).get('/payments/999').expect(404)
        })
    })

    describe('PATCH /payments/:id', () => {
        it('updates the payment with the given id', () => {
            return request(server)
                .patch(`/payments/${paymentId}`)
                .send({
                    name: 'Updated Payment'
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body.id).toEqual(paymentId)
                    expect(res.body.name).toEqual('Updated Payment')
                })
        })

        it('returns a 404 error when the payment is not found', () => {
            return request(server)
                .patch('/payments/999')
                .send({
                    name: 'Updated Payment'
                })
                .expect(404)
        })
    })

    describe('DELETE /payments/:id', () => {
        it('deletes the payment with the given id', () => {
            return request(server).delete(`/payments/${paymentId}`).expect(200)
        })

        it('returns a 404 error when the payment is not found', () => {
            return request(server).delete('/payments/999').expect(404)
        })
    })
})
