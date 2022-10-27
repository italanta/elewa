import { HandlerTools } from '@iote/cqrs';

import { Cursor, } from '@app/model/convs-mgr/conversations/admin/system';
import { Block } from '@app/model/convs-mgr/conversations/chats';

import { BotDataService } from './data-service-abstract.class';
import { Message } from '@app/model/convs-mgr/conversations/messages';
import { BaseChannel } from '@app/model/bot/channel';

/**
 * Contains all the required database flow methods for the cursor collection
 */
export class CursorDataService extends BotDataService<Cursor> {
  private _docPath: string;

  constructor(msg: Message, channel: BaseChannel, tools: HandlerTools) 
  {
    super(tools)
    this._init(msg, channel)
  }

  protected _init(msg: Message, channel: BaseChannel){
    this._docPath = `end-users/${msg.phoneNumber}/platforms/${msg.platform}/stories/${channel.storyId}/cursor`
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
      cursorId: timeStamp.toString(),
      block: newBlock,
    };
    //Update milestone
    const block = await this.createDocument(newActivity, this._docPath, newActivity.cursorId)

    // Return next block
    return block;
  }
}
