import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { DatabaseModule } from 'src/database'
import { TheatersModule } from '../theaters.module'

describe('TheatersModule', () => {
    let app: INestApplication
    let server
    let theaterId: string

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [DatabaseModule, TheatersModule]
        }).compile()

        app = module.createNestApplication()
        await app.init()

        server = app.getHttpServer()
    })

    afterAll(async () => {
        await app.close()
    })

    describe('POST /theaters', () => {
        it('creates a new theater', () => {
            return request(server)
                .post('/theaters')
                .send({
                    name: 'Theater 1'
                })
                .expect(201)
                .expect((res) => {
                    expect(res.body.id).toBeDefined()
                    expect(res.body.name).toEqual('Theater 1')

                    theaterId = res.body.id
                })
        })
    })

    describe('/theaters (GET)', () => {
        it('returns theaters with query options', async () => {
            const queryDto = {
                order: 'name:desc',
                limit: 1,
                offset: 0,
                search: 'Theater 1'
            }

            return request(server)
                .get('/theaters')
                .query(queryDto)
                .expect(200)
                .expect((res) => {
                    expect(Array.isArray(res.body.items)).toBeTruthy()
                    expect(res.body.items.length).toBe(1)
                    expect(res.body.items[0].name).toBe('Theater 1')
                    expect(typeof res.body.offset).toBe('number')
                    expect(typeof res.body.limit).toBe('number')
                    expect(typeof res.body.total).toBe('number')
                })
        })

        it('returns theaters with default options', async () => {
            return request(server)
                .get('/theaters')
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

    describe('GET /theaters/:id', () => {
        it('returns the theater with the given id', () => {
            return request(server)
                .get(`/theaters/${theaterId}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.id).toEqual(theaterId)
                    expect(res.body.name).toBeDefined()
                })
        })

        it('returns a 404 error when the theater is not found', () => {
            return request(server).get('/theaters/999').expect(404)
        })
    })

    describe('PATCH /theaters/:id', () => {
        it('updates the theater with the given id', () => {
            return request(server)
                .patch(`/theaters/${theaterId}`)
                .send({
                    name: 'Updated Theater'
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body.id).toEqual(theaterId)
                    expect(res.body.name).toEqual('Updated Theater')
                })
        })

        it('returns a 404 error when the theater is not found', () => {
            return request(server)
                .patch('/theaters/999')
                .send({
                    name: 'Updated Theater'
                })
                .expect(404)
        })
    })

    describe('DELETE /theaters/:id', () => {
        it('deletes the theater with the given id', () => {
            return request(server).delete(`/theaters/${theaterId}`).expect(200)
        })

        it('returns a 404 error when the theater is not found', () => {
            return request(server).delete('/theaters/999').expect(404)
        })
    })
})
