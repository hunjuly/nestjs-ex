import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from 'src/app.module'

/*
End-to-end 테스트는 전체 시스템이 아닌 특정한 기능이나 모듈의 동작을 테스트하는 단위 테스트와는 다르게,
시스템의 다양한 부분을 통합해서 테스트를 수행하게 됩니다.
따라서, End-to-end 테스트는 서비스를 빌드하고 배포하기 전에 수행하는 것이 좋습니다.
보통, End-to-end 테스트는 최종 사용자가 시스템을 사용하는 시나리오를 테스트하며,
이를 수행하기 위해 실제 서비스와 동일한 환경을 구성하여 수행합니다.
이러한 이유로 End-to-end 테스트는 보통 운영환경과 유사한 별도의 테스트 서버나 스테이징 서버에서 수행합니다.
또한, End-to-end 테스트는 시스템 전체를 대상으로 수행하기 때문에 수행 시간이 오래 걸리는 경우가 많습니다.
이러한 이유로 End-to-end 테스트는 빌드 파이프라인에서 자동화하여 수행하는 것이 좋습니다.
*/
describe('AppController (e2e)', () => {
    let app: INestApplication

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        }).compile()

        app = moduleFixture.createNestApplication()
        await app.init()
    })

    beforeEach(async () => {
        await app.close()
    })

    it('/ (GET)', () => {
        return request(app.getHttpServer()).get('/').expect(200).expect('Hello World!')
    })
})
