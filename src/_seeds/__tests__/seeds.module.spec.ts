import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { GlobalModule } from 'src/global'
import { SeedsModule } from '../seeds.module'

describe('SeedsModule', () => {
    let app: INestApplication
    let server
    let seedId: string

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [GlobalModule, SeedsModule]
        }).compile()

        app = module.createNestApplication()
        await app.init()

        server = app.getHttpServer()
    })

    afterAll(async () => {
        await app.close()
    })

    describe('POST /seeds', () => {
        it('creates a new seed', () => {
            return request(server)
                .post('/seeds')
                .send({
                    name: 'Seed 1'
                })
                .expect(201)
                .expect((res) => {
                    expect(res.body.id).toBeDefined()
                    expect(res.body.name).toEqual('Seed 1')

                    seedId = res.body.id
                })
        })

        it('returns 400(Bad request) when name is missing', () => {
            return request(server).post('/seeds').send({}).expect(400)
        })
    })

    describe('/seeds (GET)', () => {
        beforeAll(async () => {
            await request(server).post('/seeds').send({ name: 'Seed 2' })
            await request(server).post('/seeds').send({ name: 'Seed 3' })
        })

        it('returns seeds with default options', async () => {
            return request(server)
                .get('/seeds')
                .expect(200)
                .expect((res) => {
                    expect(Array.isArray(res.body.items)).toBeTruthy()
                    expect(res.body.items.length).toBe(3)
                    expect(typeof res.body.offset).toBe('number')
                    expect(typeof res.body.limit).toBe('number')
                    expect(typeof res.body.total).toBe('number')
                })
        })

        // curl -X GET "http://localhost:3000/seeds?orderBy=name&order=DESC&limit=1&offset=0&search=Seed%201" -H "accept: application/json"
        it('returns seeds with query options', async () => {
            const queryDto = {
                order: 'name:desc'
            }

            return request(server)
                .get('/seeds')
                .query(queryDto)
                .expect(200)
                .expect((res) => {
                    expect(Array.isArray(res.body.items)).toBeTruthy()
                    expect(res.body.items.length).toBe(3)
                    expect(res.body.items[0].name).toBe('Seed 3')
                })
        })

        it('returns seeds with query options', async () => {
            const queryDto = {
                limit: 2
            }

            return request(server)
                .get('/seeds')
                .query(queryDto)
                .expect(200)
                .expect((res) => {
                    console.log(res.body, Array.isArray(res.body.items))
                    expect(Array.isArray(res.body.items)).toBeTruthy()
                    expect(res.body.items.length).toBe(2)
                    expect(res.body.items[0].name).toBe('Seed 1')
                    expect(res.body.offset).toBe(0)
                    expect(res.body.limit).toBe(2)
                    expect(res.body.total).toBe(3)
                })
        })

        it('returns seeds with query options', async () => {
            const queryDto = {
                offset: 1
            }

            return request(server)
                .get('/seeds')
                .query(queryDto)
                .expect(200)
                .expect((res) => {
                    console.log(res.body)
                    expect(Array.isArray(res.body.items)).toBeTruthy()
                    expect(res.body.items.length).toBe(2)
                    expect(res.body.items[0].name).toBe('Seed 2')
                    expect(res.body.offset).toBe(1)
                    expect(res.body.total).toBe(3)
                })
        })
    })

    describe('GET /seeds/:id', () => {
        it('returns the seed with the given id', () => {
            return request(server)
                .get(`/seeds/${seedId}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.id).toEqual(seedId)
                    expect(res.body.name).toBeDefined()
                })
        })

        it('returns a 404 error when the seed is not found', () => {
            return request(server).get('/seeds/999').expect(404)
        })
    })

    describe('PATCH /seeds/:id', () => {
        it('updates the seed with the given id', () => {
            return request(server)
                .patch(`/seeds/${seedId}`)
                .send({
                    name: 'Updated Seed'
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body.id).toEqual(seedId)
                    expect(res.body.name).toEqual('Updated Seed')
                })
        })

        it('returns a 404 error when the seed is not found', () => {
            return request(server)
                .patch('/seeds/999')
                .send({
                    name: 'Updated Seed'
                })
                .expect(404)
        })
    })

    describe('DELETE /seeds/:id', () => {
        it('deletes the seed with the given id', () => {
            return request(server).delete(`/seeds/${seedId}`).expect(200)
        })

        it('returns a 404 error when the seed is not found', () => {
            return request(server).delete('/seeds/999').expect(404)
        })
    })
})
