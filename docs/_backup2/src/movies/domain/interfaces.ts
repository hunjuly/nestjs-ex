import { IDomainRepository } from 'src/common/domain'
import { Movie } from './movie'

export interface IMoviesRepository extends IDomainRepository<Movie> {
    findByTitle(title: string): Promise<Movie | null>
}
