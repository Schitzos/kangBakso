const { defaults: tsjPreset } = require('ts-jest/presets');

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  ...tsjPreset,
  preset: 'react-native',
  globals: {
    'ts-jest': {
      transformerConfig: {
        transformIgnorePatterns: [
          '<rootDir>/node_modules/(react-clone-referenced-element|@react-native-community|react-navigation|@react-navigation/.*|@unimodules/.*|native-base|react-native-code-push)',
          'jest-runner',
        ],
      },
    },
  },
  transform: {
    '^.+\\.jsx$': 'ts-jest',
    '^.+\\.js$': 'babel-jest', // Use babel-jest for JS files
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^@/theme$': '<rootDir>/src/theme/index.ts',
  },
  coverageReporters: ['html'],
  setupFiles: ['<rootDir>jest.setup.ts'],
};
