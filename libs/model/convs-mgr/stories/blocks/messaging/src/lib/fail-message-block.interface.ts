import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";
/**
 * Block that sends error message in the event of a failure
 */
export interface FailMessageBlock extends StoryBlock {
  /**
   * Messsage emitted about the failure
   */
  message?: string;

  defaultTarget?: string;
}
