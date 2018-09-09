'use strict'

module.exports = {
    testEnvironment: 'node',
    bail: true,
    verbose: false,
    testMatch: [
        '**/__tests__/**/*.test.js'
    ],
    moduleFileExtensions: [
        'js',
        'json'
    ],
    coverageDirectory: '<rootDir>/.coverage',
    collectCoverageFrom: [
        'lib/**/*.js',
        '!**/node_modules/**'
    ],
    setupFiles: ['./__tests__/setup.js'],
    setupTestFrameworkScriptFile: 'jest-extended'
}
