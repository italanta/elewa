import { HandlerTools } from '@iote/cqrs';

import { Cursor, EndUserPosition, RoutedCursor } from '@app/model/convs-mgr/conversations/admin/system';
import { StoryBlock } from '@app/model/convs-mgr/stories/blocks/main';

import { BotDataService } from './data-service-abstract.class';

import { SubRoutineManager } from '../sub-routine/sub-routine.class';
import { Stack } from '@app/model/convs-mgr/functions';

/**
 * When the end user is interacting with our chatbot, we need to know their current position
 *  in the story so that we can calculate the next block
 * 
 * We therefore use @type {Cursor} to save the block sent to the user and mark the current position 
 * 
 * @see Cursor.subRoutines - A subroutine is a conversational flow within another story. 
 */
export class CursorDataService extends BotDataService<Cursor> {
  private _docPath: string;
  private tools: HandlerTools;
  private _currentCursor: Cursor;

  private _subRoutineManager: SubRoutineManager;

  constructor(_tools: HandlerTools) 
  {
    super(_tools);
    this.tools = _tools;
  }

  /**
   * Returns the last position of the end user in a story. @see Story
   * 
   * As we also have Subroutines, we use the subroutine manager to get the latest cursor
   *  from an ongoing subroutine. The cursor is treated as another cursor in the bot engine 
   */
  async getLatestCursor(endUserId: string, orgId: string): Promise<Cursor | boolean>
  {
    // Set the firestore document path
    this._docPath = `orgs/${orgId}/end-users/${endUserId}/cursor`;

    // Get the latest document which is the latest cursor = the current position of the end user
    const currentCursor = await this.getLatestDocument(this._docPath);

    // If it exists we retun it otherwise return 'false'
    if (currentCursor.length > 0) {
      this._currentCursor = currentCursor[0];

      return this._currentCursor;
    } else {
      return false;
    }
  }

  /**
   * Updates the cursor collection with a new cursor(End User Position) and when applicable, updates
   *   a subroutine in the current cursor.
   * 
   * @param nextBlock The block we have sent to the end user and it marks their current position.
   * 
   * @param depthDeviation The nature of which we will deviate from the current story depth. Will we go further
   *   into another subroutine(+1) or will we go back to the previous routine(-1)? Well, it depends on the story block. 
   *     @see Cursor.storyDepth for more context
   */
  async updateCursor(endUserId: string, orgId: string, newCursor: Cursor)
  {
    const cursorId = Date.now().toString();

    // Set the document path of the cursor collection
    this._docPath = `orgs/${orgId}/end-users/${endUserId}/cursor`;

    // if(routedCursor) {
    //   if(this._currentCursor.parents.isEmpty()) {
    //     this._currentCursor.parents = new Stack<RoutedCursor>(routedCursor);
    //   } else {
    //     this._currentCursor.parents.push(routedCursor);
    //   }

    //   newCursor = {
    //     ...this._currentCursor,
    //     position: newUserPosition
    //   }
    // }

    await this.createDocument(newCursor, this._docPath, cursorId);

    this.tools.Logger.log(() => `[ChatBotService].init - Updated Cursor: ${JSON.stringify(newCursor)}`);
  }
}
