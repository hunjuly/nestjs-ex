import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from 'src/app.module'

// e2e는 순차적으로 실행이 맞다
describe('UsersController (e2e)', () => {
    let app: INestApplication
    let server
    let userId: string

    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({
            imports: [AppModule]
        }).compile()

        app = moduleFixture.createNestApplication()
        await app.init()

        server = app.getHttpServer()
    })

    afterAll(async () => {
        await app.close()
    })

    it('/users (POST)', () => {
        return request(server)
            .post('/users')
            .send({
                name: 'User 1'
            })
            .expect(201)
            .expect((res) => {
                expect(res.body.id).toBeDefined()
                expect(res.body.name).toEqual('User 1')

                userId = res.body.id
            })
    })

    it('/users (GET)', () => {
        return request(server)
            .get('/users')
            .expect(200)
            .expect((res) => {
                expect(res.body.length).toBeGreaterThan(0)
            })
    })

    it('/users/:id (GET)', () => {
        return request(server)
            .get(`/users/${userId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.id).toEqual(userId)
                expect(res.body.name).toBeDefined()
            })
    })

    it('/users/:id (GET - Not Found)', () => {
        return request(server).get('/users/999').expect(404)
    })

    it('/users/:id (PATCH)', () => {
        return request(server)
            .patch(`/users/${userId}`)
            .send({
                name: 'Updated User'
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.id).toEqual(userId)
                expect(res.body.name).toEqual('Updated User')
            })
    })

    it('/users/:id (PATCH - Not Found)', () => {
        return request(server)
            .patch('/users/999')
            .send({
                name: 'Updated User'
            })
            .expect(404)
    })

    it('/users/:id (DELETE)', () => {
        return request(server).delete(`/users/${userId}`).expect(200)
    })

    it('/users/:id (DELETE - Not Found)', () => {
        return request(server).delete('/users/999').expect(404)
    })
})
