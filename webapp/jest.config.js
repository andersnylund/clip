module.exports = {
  testEnvironment: 'jsdom',
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json',
    },
  },
  coverageThreshold: {
    global: {
      branches: 55,
      functions: 74,
      lines: 71,
      statements: 71,
    },
  },
  collectCoverageFrom: ['**/*.{ts,tsx}', '!**/node_modules/**', '!extension/**', '!cypress/**'],
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  testPathIgnorePatterns: ['<rootDir>[/\\\\](node_modules|.next|extension)[/\\\\]', 'cypress'],
  moduleNameMapper: {
    '\\.(css|less)$': '<rootDir>/test/style-mock.js',
  },
}
