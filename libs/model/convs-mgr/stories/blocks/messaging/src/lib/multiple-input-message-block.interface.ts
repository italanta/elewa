import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";
import { ButtonsBlockButton } from "../../../scenario/src";

export interface MultipleInputMessageBlock extends StoryBlock
{
  message?: string;

  defaultTarget?: string;
  
  /** Response options */
  options?: ButtonsBlockButton<Button>[];

  // Implement generic tags
  tag?: string;

  context?: string;

}

interface Button {
  id: string;
  /** Message to display as answer */
  message: string;
  /** Value the answer holds. */
  value?: string;
}
