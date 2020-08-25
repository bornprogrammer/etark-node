

module.exports = {
    "roots": [
        "<rootDir>/tests"
    ],
    "testMatch": [
        "**/*.+(ts|tsx|js)",
        "**/?(*.)+(spec|test).+(ts|tsx|js)"
    ],
    "transform": {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
    moduleNameMapper: {
        '@app/(.*)': '<rootDir>/src/$1',
        'tests/(.*)': '<rootDir>/tests/$1',
    },
}