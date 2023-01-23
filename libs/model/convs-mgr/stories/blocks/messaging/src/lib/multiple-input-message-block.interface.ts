import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";

/**
 * Block that accepts multiple inputs.
 */

export interface MultipleInputMessageBlock extends StoryBlock
{
  /**Multiple Input that is expected as input */
  message?: string;

  defaultTarget?: string;
  
  /** Response options */
  options?: MultipleOptions[];

  // Implement generic tags
  tag?: string;

  // Stores the data from the multiple input
  context?: string;

}

interface MultipleOptions {
  /** Value the answer holds. */
  values: string[]
}
