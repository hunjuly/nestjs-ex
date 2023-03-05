import { IsNotEmpty } from 'class-validator'

export class CreateSeedDto {
    @IsNotEmpty()
    readonly name: string
}
