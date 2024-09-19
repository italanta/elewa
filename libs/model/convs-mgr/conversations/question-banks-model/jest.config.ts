/* eslint-disable */
export default {
  displayName: 'question-banks-model',
  preset: '../../../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory:
    '../../../../../coverage/libs/model/convs-mgr/conversations/question-banks-model',
};
