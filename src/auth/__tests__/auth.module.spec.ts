import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { GlobalModule } from 'src/global'
import { AuthModule } from '../auth.module'

describe('AuthController (e2e)', () => {
    let app: INestApplication
    let accessToken: string
    let refreshToken: string

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [GlobalModule, AuthModule]
        }).compile()

        app = module.createNestApplication()
        await app.init()

        const createUserDto = {
            email: 'test@test.com',
            username: 'testuser',
            firstName: 'Test',
            lastName: 'User',
            birthdate: new Date(),
            password: 'testpassword'
        }

        await request(app.getHttpServer()).post('/users').send(createUserDto).expect(201)
    })

    afterAll(async () => {
        await app.close()
    })

    it('/auth/login (POST)', async () => {
        const res = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: 'test@test.com',
                password: 'testpassword'
            })
            .expect(201)

        accessToken = res.body.accessToken
        refreshToken = res.body.refreshToken
    })

    it('/auth/login (POST) with incorrect password', async () => {
        await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: 'test@test.com',
                password: 'wrongpassword'
            })
            .expect(401)
    })

    it('/auth/profile (GET)', async () => {
        await request(app.getHttpServer())
            .get('/auth/profile')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200)
    })

    it('/auth/profile (GET) with invalid access token', async () => {
        await request(app.getHttpServer())
            .get('/auth/profile')
            .set('Authorization', 'Bearer invalid_access_token')
            .expect(401)
    })

    it('/auth/refresh (POST) with invalid token', async () => {
        const res = await request(app.getHttpServer())
            .post('/auth/refresh')
            .send({ refreshToken: 'invalid-token' })
            .expect(401)

        expect(res.body.message).toEqual('Unauthorized')
    })

    it('/auth/refresh (POST)', async () => {
        const res = await request(app.getHttpServer())
            .post('/auth/refresh')
            .send({ refreshToken })
            .expect(201)

        expect(res.body.accessToken).not.toEqual(accessToken)
        expect(res.body.refreshToken).not.toEqual(refreshToken)
    })
})
