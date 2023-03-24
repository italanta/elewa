import { StoryBlockVariable } from '@app/model/convs-mgr/stories/blocks/main';

/** story block variables validation schema */
export interface NameBlockVariable extends StoryBlockVariable {
  validators ?: {
    regex: string;
    max: number;
    min: number;
    ValidationMessage: string;
  };
}
