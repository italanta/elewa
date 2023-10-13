/* eslint-disable */
export default {
  displayName:
    'private-functions-convs-mgr-conversations-message-templates-scheduler',
  preset: '../../../../../../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory:
    '../../../../../../../coverage/libs/private/functions/convs-mgr/conversations/message-templates/scheduler',
};
