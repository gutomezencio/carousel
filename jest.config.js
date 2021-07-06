module.exports = {
  setupFilesAfterEnv: ['<rootDir>/tests/setUpTests.js'],
  moduleNameMapper: {
    '^app(.*)$': '<rootDir>/src/app/$1',
    '\\.(css|sass|scss)$': '<rootDir>/tests/__mocks__/styleMock.js',
    '\\.(scoped.scss)': '<rootDir>/tests/__mocks__/styleMock.js',
    '\\.(gif|ttf|eot|svg|img)$': '<rootDir>/tests/__mocks__/fileMock.js'
  },
  testEnvironment: 'jsdom',
  verbose: true
}
