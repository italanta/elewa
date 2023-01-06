import { StoryBlock } from '@app/model/convs-mgr/stories/blocks/main';
import { IObject } from '@iote/bricks';
import { EventCategoryTypes } from './event-category-types.enum';

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
  /** The unique id of the cursor, currently we set it to the current unix timestamp
   * 
   * @see https://en.wikipedia.org/wiki/Unix_time
   */
  cursorId: string;

  /** The block in the story that is sent to the user immediately after processing their message. This marks the position of the cursor */
  currentBlock: StoryBlock;

  // TODO: Create a hashmap containing a stack of cursors
  //       Each key in the hashmap will represent the depth level of the subroutine
  // Add more documentation
  /** A stack that contains cursors */
  subRoutine?: Cursor[];

  /** Tells us if this cursor has an active subroutine
   * 
   * If there is no subroutine we typically update the position of the cursor by adding a new document
   */
  activeSubroutine: boolean;
}