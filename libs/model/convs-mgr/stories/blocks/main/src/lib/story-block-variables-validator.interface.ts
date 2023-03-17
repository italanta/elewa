import { StoryBlockVariable } from "./storyblock-variable.interface";

/** story block variables validation schema */
export interface VariablesValidator extends StoryBlockVariable {
  validators: {
    regex: string;
    max: number;
    min: number;
    ValidationMessage: string;
  };
}
