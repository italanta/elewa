import { ButtonsBlockButton } from '@app/model/convs-mgr/stories/blocks/scenario';

import { IVRStoryBlock } from "@app/model/convs-mgr/stories/blocks/main";

/**
 * Block which sends a question message in the form of text and clickable options.
 */

export interface QuestionMessageBlock extends IVRStoryBlock {

  /** Actual question */
  message?: string;

  /** Response options */
  options?: ButtonsBlockButton<Button>[];
}

export interface Button {
  id: string;
  /** Message to display as answer */
  message: string;
  /** Value the answer holds. */
  value?: string;
}