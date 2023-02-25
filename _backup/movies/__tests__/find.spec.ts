import { INestApplication } from '@nestjs/common'
import { TestRequest, createApp, createModuleWithoutGuard, createRequest, createStub } from 'src/common/jest'
import { MoviesModule } from '../movies.module'
import { SchedulesService } from '../schedules.service.mock'

describe('/movies', () => {
    let app: INestApplication
    let request: TestRequest
    let schedulesService: SchedulesService

    beforeEach(async () => {
        const module = await createModuleWithoutGuard({
            modules: [MoviesModule],
            providers: [SchedulesService]
        })

        app = await createApp(module)
        request = createRequest(app)

        schedulesService = module.get(SchedulesService)
    })

    afterEach(async () => {
        await app.close()
    })

    it('should be defined', () => {
        expect(schedulesService).toBeDefined()
    })

    describe('/ (GET)', () => {
        beforeEach(async () => {
            jest.useFakeTimers()

            const res1 = await create('movie title1')
            const res2 = await create('movie title2')
            const res3 = await create('movie title3')

            const schedules = [
                { id: 'schedule#1', showtime: 202212310900, theaterId: 'theaterId#1', movieId: res1.body.id },
                { id: 'schedule#2', showtime: 202212311200, theaterId: 'theaterId#2', movieId: res2.body.id },
                { id: 'schedule#3', showtime: 202212311400, theaterId: 'theaterId#3', movieId: res3.body.id }
            ]

            createStub(schedulesService, 'getSchedulesAfter', schedules)
        })

        afterEach(() => {
            jest.useRealTimers()
        })

        it('find buyable movies', async () => {
            jest.setSystemTime(new Date('2022/12/31 10:00'))

            console.log('now = ', new Date().toString())

            const res = await find('?buyable=true')
            const movies = res.body.items

            expect(movies.length).toBeGreaterThan(0)
        })
    })

    const create = (title, genre = ['action', 'sf']) =>
        request({
            method: 'post' as const,
            path: '/movies',
            body: {
                title,
                plot: 'movie plot',
                runningTimeSec: 120 * 60,
                director: 'director name',
                rated: 'r',
                genre,
                releaseDate: 20221231
            }
        })

    const find = (query = '') =>
        request({
            method: 'get',
            path: '/movies' + query
        })
})
