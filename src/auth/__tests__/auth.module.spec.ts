import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { DatabaseModule } from 'src/database'
import { AuthModule } from '../auth.module'

describe('AuthController (e2e)', () => {
    let app: INestApplication
    let accessToken: string
    let refreshToken: string

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [DatabaseModule, AuthModule]
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

    it('/auth/profile (GET)', async () => {
        await request(app.getHttpServer())
            .get('/auth/profile')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200)
    })

    it('/auth/refresh-token (POST)', async () => {
        const res = await request(app.getHttpServer())
            .post('/auth/refresh-token')
            .send({ refreshToken })
            .expect(201)

        expect(res.body.accessToken).not.toEqual(accessToken)
        expect(res.body.refreshToken).not.toEqual(refreshToken)
    })
})
