module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>'],
  moduleFileExtensions: ['js', 'ts', 'tsx', 'json'],
  testPathIgnorePatterns: ['<rootDir>[/\\\\](node_modules|.next|extension)[/\\\\]', 'cypress'],
  transformIgnorePatterns: ['[/\\\\](node_modules|extension)[/\\\\].+\\.(ts|tsx)$'],
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',
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
  moduleNameMapper: {
    '\\.(css|less)$': '<rootDir>/test/style-mock.js',
  },
}
