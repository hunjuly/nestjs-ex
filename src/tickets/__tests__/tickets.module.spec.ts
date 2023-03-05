import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { GlobalModule } from 'src/global'
import { TicketsModule } from '../tickets.module'

describe('TicketsModule', () => {
    let app: INestApplication
    let server
    let ticketId: string

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [GlobalModule, TicketsModule]
        }).compile()

        app = module.createNestApplication()
        await app.init()

        server = app.getHttpServer()
    })

    afterAll(async () => {
        await app.close()
    })

    describe('POST /tickets', () => {
        it('creates a new ticket', () => {
            return request(server)
                .post('/tickets')
                .send({
                    name: 'Ticket 1'
                })
                .expect(201)
                .expect((res) => {
                    expect(res.body.id).toBeDefined()
                    expect(res.body.name).toEqual('Ticket 1')

                    ticketId = res.body.id
                })
        })
    })

    describe('/tickets (GET)', () => {
        it('returns tickets with query options', async () => {
            const queryDto = {
                order: 'name:desc',
                limit: 1,
                offset: 0,
                search: 'Ticket 1'
            }

            return request(server)
                .get('/tickets')
                .query(queryDto)
                .expect(200)
                .expect((res) => {
                    expect(Array.isArray(res.body.items)).toBeTruthy()
                    expect(res.body.items.length).toBe(1)
                    expect(res.body.items[0].name).toBe('Ticket 1')
                    expect(typeof res.body.offset).toBe('number')
                    expect(typeof res.body.limit).toBe('number')
                    expect(typeof res.body.total).toBe('number')
                })
        })

        it('returns tickets with default options', async () => {
            return request(server)
                .get('/tickets')
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

    describe('GET /tickets/:id', () => {
        it('returns the ticket with the given id', () => {
            return request(server)
                .get(`/tickets/${ticketId}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.id).toEqual(ticketId)
                    expect(res.body.name).toBeDefined()
                })
        })

        it('returns a 404 error when the ticket is not found', () => {
            return request(server).get('/tickets/999').expect(404)
        })
    })

    describe('PATCH /tickets/:id', () => {
        it('updates the ticket with the given id', () => {
            return request(server)
                .patch(`/tickets/${ticketId}`)
                .send({
                    name: 'Updated Ticket'
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body.id).toEqual(ticketId)
                    expect(res.body.name).toEqual('Updated Ticket')
                })
        })

        it('returns a 404 error when the ticket is not found', () => {
            return request(server)
                .patch('/tickets/999')
                .send({
                    name: 'Updated Ticket'
                })
                .expect(404)
        })
    })

    describe('DELETE /tickets/:id', () => {
        it('deletes the ticket with the given id', () => {
            return request(server).delete(`/tickets/${ticketId}`).expect(200)
        })

        it('returns a 404 error when the ticket is not found', () => {
            return request(server).delete('/tickets/999').expect(404)
        })
    })
})
