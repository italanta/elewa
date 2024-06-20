/* eslint-disable */
export default {
  displayName: 'model-convs-mgr-stories-blocks-scenario',
  preset: '../../../../../../jest.preset.js',
  globals: {},
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory:
    '../../../../../../coverage/libs/model/convs-mgr/stories/blocks/scenario',
};
