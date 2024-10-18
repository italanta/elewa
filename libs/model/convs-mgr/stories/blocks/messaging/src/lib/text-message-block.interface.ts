import { IVRStoryBlock } from '@app/model/convs-mgr/stories/blocks/main';

/**
 * Block which sends a message in the form of text.
 */
export interface TextMessageBlock extends IVRStoryBlock {
  /** Message to accompany image. */
  message?: string;

  defaultTarget?: string;
}
