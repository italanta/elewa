import { HandlerTools } from '@iote/cqrs';

import { Cursor } from '@app/model/convs-mgr/conversations/admin/system';
import { StoryBlock } from '@app/model/convs-mgr/stories/blocks/main';

import { BotDataService } from './data-service-abstract.class';

import { SubRoutineManager } from '../sub-routine/sub-routine.class';

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
    if (currentCursor) {
      this._currentCursor = currentCursor[0];
      
      // If the depth if more than zero, we have a subroutine and we get its cursor
      if (this._currentCursor.storyDepth > 0) {
        const subRoutines = this._currentCursor.subRoutines;
        // Initialize the Subroutine Manager
        this._subRoutineManager = new SubRoutineManager(subRoutines);

        return this._subRoutineManager.getLatestCursor(this._currentCursor.storyDepth);
      }

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
  async updateCursor(endUserId: string, orgId: string, nextBlock: StoryBlock, depthDeviation?: number)
  {
    let newCursor: Cursor;
    const timeStamp = Date.now();

    // Store the current story Depth
    const STORY_DEPTH = this._currentCursor.storyDepth;

    // Set the document path of the cursor collection
    this._docPath = `orgs/${orgId}/end-users/${endUserId}/cursor`;

    // Create a new cursor from the next block that has been sent to the user.
    newCursor = {
      cursorId: timeStamp.toString(),
      currentBlock: nextBlock,
      storyDepth: 0
    } as Cursor;

    // If depthDeviation is provided then we get into the subroutine territory. 
    //   This means that we are either going to go deeper into another subroutine or go back to the
    //    previous subroutine.
    // 
    // If depthDeviation is not provided but STORY_DEPTH > 0, then there is a current active
    //  subroutine and we need to update it instead.
    if (depthDeviation) {
      // Set the depth of the new cursor to the current depth
      newCursor.storyDepth = STORY_DEPTH;

      // Increment or decrement the storydepth depending on the deviation provided.
      // +1 increments it, -1 decrements it. 
      newCursor.storyDepth = newCursor.storyDepth + depthDeviation;

      // Set the current cursor to the new cursor so that the next time updateCursor()
      //  is called we will have the current story depth and update the same cursor with
      //    the new subroutines 
      this._currentCursor = newCursor;

    } else if(STORY_DEPTH > 0) {

      newCursor.storyDepth = STORY_DEPTH;

      // Here we just play through the subroutines and return the updated sequence of cursors
      //  within it.
      this._currentCursor.subRoutines = this._subRoutineManager.run(newCursor, this._currentCursor)
    }

    // STORY_DEPTH == 0 means we are at the root story, therefore we create a new cursor document normally.
    if (STORY_DEPTH == 0) {
      await this.createDocument(newCursor, this._docPath, newCursor.cursorId);
    } else {
      // Update the current cursor document with the new position of the enduser in the subroutine
      await this.updateDocument(this._currentCursor, this._docPath, this._currentCursor.id);
    }

    this.tools.Logger.log(() => `[ChatBotService].init - Updated Cursor: ${JSON.stringify(newCursor)}`);
  }
}
