import { IObject } from '@iote/bricks';

import { StoryBlock } from '@app/model/convs-mgr/stories/blocks/main';
import { Stack } from '@app/model/convs-mgr/functions';

import { EventCategoryTypes } from './event-category-types.enum';
import { RoutedCursor } from './routed-cursor.interface';

export interface Event
{
  category: EventCategoryTypes;
  type: string;
  dateCreated: string;
  payload: {};
  origin: string; //Id of the party that triggered the event
  subject: string; //Id of the party affected by the event
}

/**
 * A story is a conversational flow that models the 
 *    interaction between a chatbot actor (the engine) and a physical actor (an end user).
 * 
 * A story @see {Story} is made up of blocks @see {StoryBlock}
 * 
 * When the end user is interacting with our chatbot, we need to know their current position
 *  in the story so that we can calculate the next block
 * 
 * We therefore use @type {Cursor} to save the block sent to the user and mark the current position 
 */
export interface Cursor extends IObject
{
  /** 
   * The current position of the End user in a story
   */
  position: EndUserPosition;

  /**
   * A subroutine is a conversational flow within another story. 
   * 
   * While we can have a one dimensional story that just contains StoryBlocks until the end, it is possible 
   *  that a user might need to integrate another story in the same story.
   * 
   * Therefore we need a way to implement this wihout affecting the flow of the main story. So we call these 
   *  substories/subprocedures in a story Subroutines.
   * 
   * We will need to stack the cursors in order such that the latest user position is on top. Therefore we use
   *  @see Stack data structure. Each subroutine is a stack on cursors.
   * 
   * Because we can have a subroutine inside a subroutine, we use an array to save the muliple subroutines. Whereby
   *  the first index is the current subroutine being run. The array follows the stack concept we use an array so that 
   *    we can be able to go back to the previous subroutine without deleting any items.
   * 
   * @example
   *  [Subroutine4, Subroutine3, Subroutine2, Subroutine1]
   *   
   */
  parentStack?: Stack<RoutedCursor>;
}

/** 
 * The current position of the End user in a story.
 *   We store the id of the story block that we send to the end user,
 *    so that we can use it to get the next connection and block
 *     when they reply.
 */
export interface EndUserPosition {
  storyId: string;

  /** The block in the story that is sent to the user immediately after processing their message. This marks the position of the cursor */
  blockId: string;
}