import { HandlerTools } from '@iote/cqrs';

import { Cursor, } from '@app/model/convs-mgr/conversations/admin/system';
import { StoryBlock } from '@app/model/convs-mgr/stories/blocks/main';

import { BotDataService } from './data-service-abstract.class';

import { Stack } from '../../utils/stack.util';

/**
 * Contains all the required database flow methods for the cursor collection
 */
export class CursorDataService extends BotDataService<Cursor> {
  private _docPath: string;
  private tools: HandlerTools;
  private _currentCursor: Cursor;

  constructor(_tools: HandlerTools) 
  {
    super(_tools);
    this.tools = _tools;
    // this._init(msg, channel)
  }

  // protected _init(msg: Message, channel: CommunicationChannel){
  //   this._docPath = `end-users/${msg.phoneNumber}/platforms/${msg.platform}/stories/${channel.storyId}/cursor`
  // }

  /** Returns the latest position of the cursor */
  async getLatestCursor(endUserId: string, orgId: string): Promise<Cursor | boolean>
  {
    this._docPath = `orgs/${orgId}/end-users/${endUserId}/cursor`;

    const currentCursor = await this.getLatestDocument(this._docPath);

    if (currentCursor)
    {
      this._currentCursor = currentCursor[0];

      if(this._currentCursor.activeSubroutine) {

        const currentSubroutine = this._currentCursor.activeSubroutine
        const subRoutineStack = new Stack(currentSubroutine);

        return subRoutineStack.peek();
      }

      return this._currentCursor;
    } else
    {
      return false;
    }
  }

  /** Updates the cursor with the block */
  async updateCursor(endUserId: string, orgId: string, nextBlock: StoryBlock, futureBlock?: StoryBlock): Promise<Cursor>
  {
    let newCursor: Cursor;
    const timeStamp = Date.now();

    this._docPath = `orgs/${orgId}/end-users/${endUserId}/cursor`;

    newCursor = {
      cursorId: timeStamp.toString(),
      currentBlock: nextBlock,
      activeSubroutine: false,
    } as Cursor


    if(nextBlock.storyDepth > 0) {
     
     this._currentCursor.subRoutine = this._updateSubroutine(newCursor);

     await this.updateDocument(this._currentCursor, this._docPath, this._currentCursor.id);
    }

    //Update milestone
    const block = await this.createDocument(newCursor, this._docPath, newCursor.cursorId);

    this.tools.Logger.log(() => `[ChatBotService].init - Updated Cursor`);
    // Return next block
    return block;
  }

  /** Update/Create a subroutine */
  private _updateSubroutine(cursor: Cursor)
  {
    let subRoutineStack: Stack;

      const subroutine = this._currentCursor.subRoutine

      if(!subroutine) {
        subRoutineStack =  new Stack(cursor);
      } else {
        subRoutineStack = new Stack(subroutine);

        subRoutineStack.push(cursor);
      }

     return subRoutineStack.getItems();
  }
}
