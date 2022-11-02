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
export interface Cursor extends IObject{
  /** The unique id of the cursor, currently we set it to the current unix timestamp
   * 
   * @see https://en.wikipedia.org/wiki/Unix_time
   */
  cursorId: string;

  /** The block in the story that is sent to the user immediately after processing their message. This marks the position of the cursor */
  currentBlock: StoryBlock;

  /**
   * Calculating the next block requires us to do some database calls which can take time and delay the response back to the user
   *    In a story there are blocks with only one default option (this means that regardless of the user input, the next block is the same) 
   *      e.g. TextMessageBlock, AudioMessageBlock, DocumentMessageBlock
   * 
   * With these blocks, we already know the response to send back to the end user, before they respond to the chatbot.
   *    So we can save these 'already known' blocks here to reduce database calls and increase response time.
   */
  futureBlock?: StoryBlock;
}