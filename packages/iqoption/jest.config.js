const path = require('path')

const baseConfig = require('../../jest.config')

const pkg = require('./package.json')

delete baseConfig.projects

const testsPath = path.join(__dirname, '__tests__')

module.exports = {
  ...baseConfig,
  displayName: pkg.name,
  testEnvironment: 'node',
  setupFilesAfterEnv: [path.join(testsPath, 'setupTests.ts')],
  testMatch: [path.join(testsPath, '**/*.spec.{ts,tsx}')],
}
