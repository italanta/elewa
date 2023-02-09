export interface StoryBlockVariable {
  name: string,
  type: VariableTypes
}

export enum VariableTypes {
  String                    = 1,
  Number                    = 2,
  Array                     = 3,
  ArrayWithTypeAndValue     = 4
}