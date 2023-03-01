import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { DatabaseModule } from 'src/database'
import { SeedsModule } from '../seeds.module'

describe('SeedsModule', () => {
    let app: INestApplication
    let server
    let seedId: string

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [DatabaseModule, SeedsModule]
        }).compile()

        app = module.createNestApplication()
        await app.init()

        server = app.getHttpServer()
    })

    afterAll(async () => {
        await app.close()
    })

    it('/seeds (POST)', () => {
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

    it('/seeds (GET)', () => {
        return request(server)
            .get('/seeds')
            .expect(200)
            .expect((res) => {
                expect(res.body.length).toBeGreaterThan(0)
            })
    })

    it('/seeds/:id (GET)', () => {
        return request(server)
            .get(`/seeds/${seedId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.id).toEqual(seedId)
                expect(res.body.name).toBeDefined()
            })
    })

    it('/seeds/:id (GET - Not Found)', () => {
        return request(server).get('/seeds/999').expect(404)
    })

    it('/seeds/:id (PATCH)', () => {
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

    it('/seeds/:id (PATCH - Not Found)', () => {
        return request(server)
            .patch('/seeds/999')
            .send({
                name: 'Updated Seed'
            })
            .expect(404)
    })

    it('/seeds/:id (DELETE)', () => {
        return request(server).delete(`/seeds/${seedId}`).expect(200)
    })

    it('/seeds/:id (DELETE - Not Found)', () => {
        return request(server).delete('/seeds/999').expect(404)
    })
})
