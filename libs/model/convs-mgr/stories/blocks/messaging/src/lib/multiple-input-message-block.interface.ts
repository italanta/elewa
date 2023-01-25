import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";

/**
 * Block that accepts multiple inputs.
 */

export interface MultipleInputMessageBlock extends StoryBlock
{
  /**Multiple Input that is expected as input */
  message?: string;
  addMore?: string;

  defaultTarget?: string;
  
  /** Response options */
  options?: MultipleOptions[];


}

interface MultipleOptions {
  /** Value the answer holds. */
  values: string[]
}
