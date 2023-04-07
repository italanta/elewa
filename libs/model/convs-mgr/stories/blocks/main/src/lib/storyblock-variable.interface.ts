import { StoryBlockVariableValidators } from "./story-block-variable-validators.interface";

export interface StoryBlockVariable {
  name: string,
  type: VariableTypes,
  validate: boolean,
  validators?: StoryBlockVariableValidators
}

export enum VariableTypes {
  String                    = 1,
  Number                    = 2,
  Array                     = 3,
  ArrayWithTypeAndValue     = 4
}
