export interface StoryBlockVariable {
  name: string,
  type: VariableTypes
}

export enum VariableTypes {
  String  = 1,
  Number  = 2,
  ArrayOfStrings   = 3,
  ArrayOfObjects = 4
}