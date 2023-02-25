export type MovieRating = 'r' | 'pg' | 'pg-13' | 'nc-17'
export type MovieGenre = 'drama' | 'action' | 'adventure' | 'comedy' | 'horror' | 'romance' | 'thriller'

export class CreateMovieCmd {
    title: string
    plot: string
    runningTimeSec: number
    director: string
    rated: MovieRating
    genre: MovieGenre[]
    releaseDate: string
}

export type UpdateMovieCmd = Partial<CreateMovieCmd>
