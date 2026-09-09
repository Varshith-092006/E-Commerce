module.exports = {
  testEnvironment: 'node',
  testTimeout: 15000,
  setupFilesAfterEnv: ['<rootDir>/tests/setup/jest.teardown.js'],
  transform: {},
  coverageDirectory: '<rootDir>/coverage',
  testMatch: [
    '<rootDir>/packages/*/tests/**/*.test.js',
    '<rootDir>/services/*/tests/**/*.test.js',
  ],
  collectCoverageFrom: [
    'services/*/src/**/*.js',
    'packages/*/src/**/*.js',
    '!**/node_modules/**',
    '!**/prisma/generated/**',
  ],
};
