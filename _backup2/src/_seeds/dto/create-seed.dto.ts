import { IsNotEmpty } from 'class-validator'

export class CreateSeedDto {
    /**
     * 빈 문자열은 허용하지 않는다.
     */
    @IsNotEmpty()
    name: string
}
