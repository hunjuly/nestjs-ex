import type { Config } from '@jest/types'

// Sync object
const config: Config.InitialOptions = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: '.',
    roots: ['<rootDir>/src/'],
    testRegex: '.*\\.(spec|test)\\.ts$',
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1'
    },
    testEnvironment: 'node',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest'
    },
    collectCoverageFrom: ['src/**/*.ts'],
    coveragePathIgnorePatterns: ['__tests__'],
    coverageDirectory: './coverage'
}

export default config
// "jest": {
//     "moduleFileExtensions": [
//       "js",
//       "json",
//       "ts"
//     ],
//     "rootDir": "src",
//     "testRegex": ".*\\.spec\\.ts$",
//     "transform": {
//       "^.+\\.(t|j)s$": "ts-jest"
//     },
//     "collectCoverageFrom": [
//       "**/*.(t|j)s"
//     ],
//     "coverageDirectory": "../coverage",
//     "testEnvironment": "node"
//   }
