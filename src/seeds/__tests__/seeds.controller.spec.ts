// import { Test, TestingModule } from '@nestjs/testing'
// import { SeedsController } from './seeds.controller'
// import { SeedsService } from './seeds.service'
// describe('SeedsController', () => {
//     let controller: SeedsController
//     beforeEach(async () => {
//         const module: TestingModule = await Test.createTestingModule({
//             controllers: [SeedsController],
//             providers: [SeedsService]
//         }).compile()
//         controller = module.get<SeedsController>(SeedsController)
//     })
//     it('should be defined', () => {
//         expect(controller).toBeDefined()
//     })
// })
import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { AppModule } from 'src/app.module'
import { Seed } from 'src/seeds/entities'

describe('SeedsController (e2e)', () => {
    let app: INestApplication
    let seedRepository: Repository<Seed>

    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({
            imports: [AppModule]
        }).compile()

        app = moduleFixture.createNestApplication()
        await app.init()

        seedRepository = moduleFixture.get<Repository<Seed>>(getRepositoryToken(Seed))
    })

    beforeEach(async () => {
        await seedRepository.clear()
    })

    afterAll(async () => {
        await app.close()
    })

    describe('/seeds (POST)', () => {
        it('should create a new seed', async () => {
            const createSeedDto = { name: 'test seed' }
            const response = await request(app.getHttpServer()).post('/seeds').send(createSeedDto).expect(201)

            expect(response.body).toMatchObject(createSeedDto)

            const seed = await seedRepository.findOne(response.body.id)
            expect(seed).toMatchObject(createSeedDto)
        })
    })

    describe('/seeds (GET)', () => {
        it('should get all seeds', async () => {
            const createSeedDto = { name: 'test seed' }
            await seedRepository.save(seedRepository.create(createSeedDto))

            const response = await request(app.getHttpServer()).get('/seeds').expect(200)

            expect(response.body.length).toBe(1)
            expect(response.body[0]).toMatchObject(createSeedDto)
        })
    })

    describe('/seeds/:id (GET)', () => {
        it('should get a seed by id', async () => {
            const createSeedDto = { name: 'test seed' }
            const savedSeed = await seedRepository.save(seedRepository.create(createSeedDto))

            const response = await request(app.getHttpServer()).get(`/seeds/${savedSeed.id}`).expect(200)

            expect(response.body).toMatchObject(createSeedDto)
        })
    })

    describe('/seeds/:id (PATCH)', () => {
        it('should update a seed by id', async () => {
            const createSeedDto = { name: 'test seed' }
            const savedSeed = await seedRepository.save(seedRepository.create(createSeedDto))

            const updateSeedDto = { name: 'updated test seed' }
            const response = await request(app.getHttpServer())
                .patch(`/seeds/${savedSeed.id}`)
                .send(updateSeedDto)
                .expect(200)

            expect(response.body).toMatchObject(updateSeedDto)

            const seed = await seedRepository.findOne(savedSeed.id)
            expect(seed).toMatchObject(updateSeedDto)
        })
    })

    describe('/seeds/:id (DELETE)', () => {
        it('should delete a seed by id', async () => {
            const createSeedDto = { name: 'test seed' }
            const savedSeed = await seedRepository.save(seedRepository.create(createSeedDto))

            await request(app.getHttpServer()).delete(`/seeds/${savedSeed.id}`).expect(200)

            const seed = await seedRepository.findOne(savedSeed.id)
            expect(seed).toBeUndefined()
        })
    })
})
