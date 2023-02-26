import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from 'src/app.module'

// e2e는 순차적으로 실행이 맞다
describe('SeedsController (e2e)', () => {
    let app: INestApplication

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile()

        app = moduleFixture.createNestApplication()
        await app.init()
    })

    afterAll(async () => {
        await app.close()
    })

    let seedId: string

    it('/seeds (POST)', () => {
        return request(app.getHttpServer())
            .post('/seeds')
            .send({
                name: 'Seed 1'
            })
            .expect(201)
            .expect((res) => {
                expect(res.body.id).toBeDefined()
                expect(res.body.name).toEqual('Seed 1')
            })
    })

    it('/seeds (GET)', () => {
        return request(app.getHttpServer())
            .get('/seeds')
            .expect(200)
            .expect((res) => {
                expect(res.body.length).toBeGreaterThan(0)
            })
    })

    it('/seeds/:id (GET)', () => {
        return request(app.getHttpServer())
            .get(`/seeds/${seedId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.id).toEqual(seedId)
                expect(res.body.name).toBeDefined()
            })
    })

    // it('/seeds/:id (GET)', () => {
    //     return request(app.getHttpServer())
    //         .get('/seeds/1')
    //         .expect(200)
    //         .expect((res) => {
    //             expect(res.body.id).toEqual(1)
    //             expect(res.body.name).toBeDefined()
    //         })
    // })

    it('/seeds/:id (GET - Not Found)', () => {
        return request(app.getHttpServer()).get('/seeds/999').expect(404)
    })

    // it('/seeds/:id (PATCH)', () => {
    //     return request(app.getHttpServer())
    //         .patch('/seeds/1')
    //         .send({
    //             name: 'Updated Seed'
    //         })
    //         .expect(200)
    //         .expect((res) => {
    //             expect(res.body.id).toEqual(1)
    //             expect(res.body.name).toEqual('Updated Seed')
    //         })
    // })

    it('/seeds/:id (PATCH)', () => {
        return request(app.getHttpServer())
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
        return request(app.getHttpServer())
            .patch('/seeds/999')
            .send({
                name: 'Updated Seed'
            })
            .expect(404)
    })

    it('/seeds/:id (DELETE)', () => {
        return request(app.getHttpServer()).delete(`/seeds/${seedId}`).expect(204)
    })

    // it('/seeds/:id (DELETE)', () => {
    //     return request(app.getHttpServer()).delete('/seeds/1').expect(204)
    // })

    it('/seeds/:id (DELETE - Not Found)', () => {
        return request(app.getHttpServer()).delete('/seeds/999').expect(404)
    })
})
