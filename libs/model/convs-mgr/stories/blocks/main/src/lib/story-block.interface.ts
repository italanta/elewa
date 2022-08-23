import { IObject } from "@iote/bricks";

import { Position } from "./position.interface";
import { StoryBlockTypes } from "./story-block-types.enum";

/**
 * A block is a main element of conversation. 
 * 
 * In general it a single interaction event, 
 *  meaning a single message "to" or "from" the chat user 
 *    OR a to/from pair (e.g. question/response or btn-message).
 * 
 * Besides that, special types of blocks such as scenario blocks etc. 
 *  exist which have different behaviours depending the button.
 * 
 * @note A StoryBlock is an "abstract interface", meaning it should only be used directly in the case of polymorphist-intended behaviour but never directly created.
 * @note A StoryBlock doubles as a JSPlumb Node in the editor (@see https://docs.jsplumbtoolkit.com/toolkit/5.x/lib/graph)
 */
export interface StoryBlock extends IObject
{
  /** Block Type */
  type: StoryBlockTypes;

  /** Position of the block on the editor */
  position: Position;

  /** Whether the block has been deleted and should no longer be used in new flows */
  deleted: boolean;

  blockIcon: string;
  blockTitle: string;
  // ! Type to be inherited by all the different blocks.
}
