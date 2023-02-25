export class CreateSeedCmd {
    name: string
}

export type UpdateSeedCmd = Partial<CreateSeedCmd>
