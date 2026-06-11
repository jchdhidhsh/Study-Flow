const path = require('path');

module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.test.js'],
  rootDir: '.',
  roots: ['<rootDir>'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@test/(.*)$': '<rootDir>/test/$1'
  }
};
