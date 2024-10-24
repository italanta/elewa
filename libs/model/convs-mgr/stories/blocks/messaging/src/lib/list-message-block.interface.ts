import { IVRStoryBlock } from "@app/model/convs-mgr/stories/blocks/main";
import { ButtonsBlockButton } from "@app/model/convs-mgr/stories/blocks/scenario";

export interface ListMessageBlock extends IVRStoryBlock {

  /** Actual question */
  message?: string;

  /** Response options */
  options?: ButtonsBlockButton<Button>[];
}

interface Button {
  id: string;
  /** Message to display as answer */
  message: string;
  /** Value the answer holds. */
  value?: string;
}