import type { Config } from '@jest/types'

// Sync object
const config: Config.InitialOptions = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: '.',
    roots: ['<rootDir>/src/'],
    testRegex: '.*\\.(spec|e2e-spec)\\.ts$',
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1'
    },
    testEnvironment: 'node',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest'
    },
    collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/index.{ts,tsx}', '!src/main.ts'],
    coveragePathIgnorePatterns: ['__tests__'],
    coverageDirectory: './coverage'
}

export default config
