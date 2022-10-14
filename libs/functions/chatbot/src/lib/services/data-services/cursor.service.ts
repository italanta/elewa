import { Query } from '@ngfi/firestore-qbuilder';
import { HandlerTools } from '@iote/cqrs';

import { Cursor, } from '@app/model/convs-mgr/conversations/admin/system';
import { Block } from '@app/model/convs-mgr/conversations/chats';

import { BotDataService } from './data-service-abstract.class';
import { BaseMessage } from '@app/model/convs-mgr/conversations/messages';

/**
 * Contains all the required database flow methods for the cursor collection
 */
export class CursorDataService extends BotDataService<Cursor> {
  private _docPath: string;

  constructor(msg: BaseMessage, tools: HandlerTools) 
  {
    super(tools)
    this._init(msg)
  }

  protected _init(msg: BaseMessage){
    this._docPath = `end-users/${msg.platform}/${msg.phoneNumber}/stories/${msg.storyId}/cursor`
  }
  
  /** Returns the latest activity / latest position of the cursor */
  async getLatestCursor(): Promise<Cursor | boolean>{
    const latestBlock = await this.getLatestDocument(this._docPath)
    
    if (latestBlock){
      return latestBlock[0]
    } else {
      return false;
    }
  }

  /** Updates the cursor with the block */
  async updateCursor(newBlock: Block): Promise<Cursor> {

    const timeStamp = Date.now();
    const newActivity: Cursor = {
      chatId: timeStamp.toString(),
      block: newBlock,
    };
    //Update milestone
    const block = await this.createDocument(newActivity, this._docPath, newActivity.chatId)

    // Return next block
    return block;
  }
}
