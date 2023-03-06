import { Column, Entity, ValueTransformer } from 'typeorm'
import { AggregateRoot } from 'src/common/base'

export enum Rated {
    G = 'G',
    PG = 'PG',
    PG13 = 'PG13',
    R = 'R',
    NC17 = 'NC17'
}

export enum Genre {
    action = 'action',
    adventure = 'adventure',
    animation = 'animation',
    comedy = 'comedy',
    crime = 'crime',
    drama = 'drama',
    family = 'family',
    fantasy = 'fantasy',
    horror = 'horror',
    music = 'music',
    romance = 'romance',
    sf = 'sf',
    thriller = 'thriller',
    war = 'war',
    western = 'western'
}

const genresTransformer: ValueTransformer = {
    to: (value: Genre[] | null): string | null => {
        if (value == null) {
            return null
        }
        return value.join(',')
    },
    from: (value: string | null): Genre[] | null => {
        if (value == null) {
            return null
        }
        return value.split(',') as Genre[]
    }
}

@Entity()
export class Movie extends AggregateRoot {
    @Column()
    title: string

    @Column({ type: 'text' })
    plot: string

    @Column({ type: 'integer' })
    runningTimeInMinutes: number

    @Column()
    director: string

    @Column({ type: 'varchar' })
    rated: Rated

    @Column({ type: 'varchar', transformer: genresTransformer })
    genres: Genre[]

    @Column({ type: 'datetime' })
    releaseDate: Date
}
