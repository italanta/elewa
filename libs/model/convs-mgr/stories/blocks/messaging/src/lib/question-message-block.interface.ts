import { ButtonsBlockButton } from '@app/model/convs-mgr/stories/blocks/scenario';

import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";

/**
 * Block which sends a question message in the form of text and clickable options.
 */

export interface QuestionMessageBlock extends StoryBlock{

  /** Actual question */
  message?: string;

  defaultTarget?: string;

  /** Response options */
  options?: ButtonsBlockButton<any>[];
}