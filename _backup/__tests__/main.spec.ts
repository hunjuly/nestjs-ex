import { INestApplication } from '@nestjs/common'
import { Controller, Get } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from 'src/app.module'
import { AppService } from 'src/app.service'
import { SystemException } from 'src/common'
import { TestRequest, createApp, createRequest } from 'src/common/jest'

describe('main', () => {
    let app: INestApplication
    let request: TestRequest

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [AppModule],
            controllers: [TestController]
        }).compile()

        app = await createApp(module)
        request = createRequest(app)
    })

    afterEach(async () => {
        await app.close()
    })

    it('catch SytemException & shutdown', async () => {
        const appService = app.get(AppService)

        const spy = jest.spyOn(appService, 'subscribeToShutdown')

        appService.subscribeToShutdown(() => {})

        await request({ method: 'get', path: '/throw-exception' })

        expect(spy).toBeCalled()
    })
})

@Controller('throw-exception')
class TestController {
    @Get()
    method() {
        throw new SystemException()
    }
}
