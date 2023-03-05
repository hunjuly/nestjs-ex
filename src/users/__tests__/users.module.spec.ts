import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { GlobalModule } from 'src/global'
import { UsersModule } from '../users.module'

describe('UsersController (e2e)', () => {
    let app: INestApplication
    let server
    let userId: string

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [GlobalModule, UsersModule]
        }).compile()

        app = module.createNestApplication()
        await app.init()

        server = app.getHttpServer()
    })

    afterAll(async () => {
        await app.close()
    })

    const createUserDto = {
        email: 'user@mail.com',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        birthdate: new Date(),
        password: 'password'
    }

    it('/users (POST)', () => {
        return request(server)
            .post('/users')
            .send(createUserDto)
            .expect(201)
            .expect((res) => {
                expect(res.body.id).toBeDefined()
                expect(res.body.username).toEqual('testuser')

                userId = res.body.id
            })
    })

    it('should return 409 if email is already taken', () => {
        return request(server).post('/users').send(createUserDto).expect(409)
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
                expect(res.body.username).toBeDefined()
            })
    })

    it('/users/:id (GET - Not Found)', () => {
        return request(server).get('/users/999').expect(404)
    })

    it('/users/:id (PATCH)', () => {
        return request(server)
            .patch(`/users/${userId}`)
            .send({
                username: 'Updated User'
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.id).toEqual(userId)
                expect(res.body.username).toEqual('Updated User')
            })
    })

    it('/users/:id (PATCH - Not Found)', () => {
        return request(server)
            .patch('/users/999')
            .send({
                username: 'Updated User'
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
