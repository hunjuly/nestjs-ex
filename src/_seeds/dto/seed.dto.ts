import { IsNotEmpty, IsUUID } from 'class-validator'
import { Seed } from '../entities'

// 클라이언트로부터 전달되는 데이터의 유효성을 검증
export class SeedDto {
    @IsUUID()
    id: string

    @IsNotEmpty()
    name: string

    constructor(seed: Seed) {
        const { id, name } = seed

        this.id = id
        this.name = name
    }
}
