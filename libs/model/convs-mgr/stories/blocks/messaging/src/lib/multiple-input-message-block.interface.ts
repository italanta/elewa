import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";
import { ButtonsBlockButton } from "../../../scenario/src";

export interface MultipleInputMessageBlock extends StoryBlock
{
  message?: string;

  defaultTarget?: string;
  
  /** Response options */
  options?: MultipleOptions[];

  // Implement generic tags
  tag?: string;

  context?: string;

}

interface MultipleOptions {
  values: string[]
}
