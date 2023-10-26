/* eslint-disable */
export default {
  displayName: 'private-model-convs-mgr-micro-apps-cmi5',
  preset: '../../../../../../jest.preset.js',
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
    '../../../../../../coverage/libs/private/model/convs-mgr/micro-apps/cmi5',
};
