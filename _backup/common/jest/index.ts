import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import * as supertest from 'supertest'
import { AdminGuard, JwtAuthGuard, SelfGuard } from 'src/auths'
import { GlobalModule } from 'src/global.module'
import { NullGuard } from './null.guard'
import { NullLogger } from './null.logger'

export function createSpy(object: any, method: string, args: any[] | undefined | null, response: any) {
    return jest.spyOn(object, method).mockImplementation(async (...recv) => {
        if (args) {
            expect(recv).toEqual(args)
        }

        return response
    })
}

export function createStub(object: any, method: string, response: any) {
    return jest.spyOn(object, method).mockImplementation(async () => {
        return response
    })
}

export function createTypeOrmMock() {
    return {
        findOneBy: jest.fn(),
        findAndCount: jest.fn(),
        delete: jest.fn(),
        save: jest.fn(),
        update: jest.fn()
    }
}

export async function createModuleWithoutGuard(injections: {
    modules?: any[]
    controllers?: any[]
    providers?: any[]
    imports?: any[]
}) {
    // TODO modules는 지우고 imports만 남겨라
    const modules = injections.modules ?? []
    const imports = injections.imports ?? []
    const controllers = injections.controllers ?? []
    const providers = injections.providers ?? []

    const builder = Test.createTestingModule({
        imports: [GlobalModule, ...modules, ...imports],
        controllers,
        providers
    })
    builder.overrideGuard(SelfGuard).useClass(NullGuard)
    builder.overrideGuard(AdminGuard).useClass(NullGuard)
    builder.overrideGuard(JwtAuthGuard).useClass(NullGuard)

    const module = await builder.compile()

    return module
}

export async function createApp(module: TestingModule) {
    const app = module.createNestApplication()

    // 테스트에 로그가 출력되면 테스트 결과를 읽기 힘들다.
    app.useLogger(new NullLogger())

    await app.init()

    return app
}

export interface RequestValue {
    method: 'post' | 'put' | 'patch' | 'get' | 'delete'
    path: string
    body?: string | object
    accessToken?: string
}

export type TestRequest = (context: RequestValue) => any

export function createRequest(app: INestApplication): TestRequest {
    const request = () => supertest(app.getHttpServer())

    return (value: RequestValue) => {
        let context

        if (value.method === 'post') {
            context = request().post(value.path).send(value.body)
        } else if (value.method === 'put') {
            context = request().put(value.path).send(value.body)
        } else if (value.method === 'patch') {
            context = request().patch(value.path).send(value.body)
        } else if (value.method === 'get') {
            context = request().get(value.path)
        } else if (value.method === 'delete') {
            context = request().delete(value.path)
        }

        if (value.accessToken) {
            context = context.set('Authorization', 'Bearer ' + value.accessToken)
        }

        return context
    }
}
