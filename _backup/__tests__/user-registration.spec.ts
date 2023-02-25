import { HttpStatus, INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from 'src/app.module'
import { TestRequest, createApp, createRequest } from 'src/common/jest'

describe('users & auths services', () => {
    let app: INestApplication
    let request: TestRequest

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [AppModule]
        }).compile()

        app = await createApp(module)
        request = createRequest(app)
    })

    afterAll(async () => {
        await app.close()
    })

    const loginDto = {
        email: 'memberA@mail.com',
        password: '1234'
    }

    const createDto = {
        ...loginDto,
        username: 'memberA',
        role: 'member'
    }

    let userId = null
    let accessToken = null
    let refreshToken = null

    it('1. user 등록', async () => {
        const res = await request({
            method: 'post',
            path: '/users',
            body: createDto
        })

        expect(res.status).toEqual(HttpStatus.CREATED)

        userId = res.body.id
    })

    it('2. login', async () => {
        const res = await request({
            method: 'post',
            path: '/auths/login',
            body: loginDto
        })

        expect(res.status).toEqual(HttpStatus.CREATED)

        accessToken = res.body.accessToken
        refreshToken = res.body.refreshToken
    })

    it('3. 서비스 사용', async () => {
        const res = await request({
            method: 'get',
            path: '/users/' + userId,
            accessToken
        })

        expect(res.status).toEqual(HttpStatus.OK)
    })

    it('4. refresh 성공', async () => {
        const res = await request({
            method: 'post',
            path: '/auths/refresh',
            body: { refreshToken }
        })

        expect(res.status).toEqual(HttpStatus.CREATED)
    })

    it('5. user 삭제', async () => {
        const res = await request({
            method: 'delete',
            path: '/users/' + userId,
            accessToken
        })

        expect(res.status).toEqual(HttpStatus.OK)
    })

    it('6. refresh 실패', async () => {
        const res = await request({
            method: 'post',
            path: '/auths/refresh',
            body: { refreshToken }
        })

        expect(res.status).toEqual(HttpStatus.UNAUTHORIZED)
    })
})
