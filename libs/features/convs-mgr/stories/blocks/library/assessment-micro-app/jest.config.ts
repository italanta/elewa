/* eslint-disable */
export default {
  displayName: 'features-convs-mgr-stories-blocks-library-assessment-micro-app',
  preset: '../../../../../../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory:
    '../../../../../../../coverage/libs/features/convs-mgr/stories/blocks/library/assessment-micro-app',
};
