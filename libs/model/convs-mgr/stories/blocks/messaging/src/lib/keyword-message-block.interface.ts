import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";
import { ButtonsBlockButton } from "@app/model/convs-mgr/stories/blocks/scenario";
export interface KeywordMessageBlock extends StoryBlock{

  /** Actual question */
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