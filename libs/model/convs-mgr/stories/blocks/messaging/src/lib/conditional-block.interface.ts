import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";
import { ButtonsBlockButton } from "@app/model/convs-mgr/stories/blocks/scenario";

export interface ConditionalBlock extends StoryBlock {

  /** Actual  variable */
  message?: string;

  /** Whether the variable is typed and not selected, we save this for ux reasons  */
  isTyped?: boolean;

  defaultTarget?: string;

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