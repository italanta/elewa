import { HandlerTools } from '@iote/cqrs';

import { Cursor, } from '@app/model/convs-mgr/conversations/admin/system';
import { StoryBlock } from '@app/model/convs-mgr/stories/blocks/main';

import { BotDataService } from './data-service-abstract.class';

/**
 * Contains all the required database flow methods for the cursor collection
 */
export class CursorDataService extends BotDataService<Cursor> {
  private _docPath: string;

  constructor(tools: HandlerTools) 
  {
    super(tools);
    // this._init(msg, channel)
  }

  // protected _init(msg: Message, channel: CommunicationChannel){
  //   this._docPath = `end-users/${msg.phoneNumber}/platforms/${msg.platform}/stories/${channel.storyId}/cursor`
  // }

  /** Returns the latest activity / latest position of the cursor */
  async getLatestCursor(endUserId: string, orgId: string): Promise<Cursor | boolean>
  {
    this._docPath = `orgs/${orgId}/end-users/${endUserId}/cursor`;

    const latestBlock = await this.getLatestDocument(this._docPath);

    if (latestBlock)
    {
      return latestBlock[0];
    } else
    {
      return false;
    }
  }

  /** Updates the cursor with the block */
  async updateCursor(endUserId: string, orgId: string, currentBlock: StoryBlock, futureBlock?: StoryBlock): Promise<Cursor>
  {

    this._docPath = `orgs/${orgId}/end-users/${endUserId}/cursor`;

    const timeStamp = Date.now();
    const newActivity: Cursor = {
      cursorId: timeStamp.toString(),
      currentBlock,
      futureBlock: futureBlock || null
    };
    //Update milestone
    const block = await this.createDocument(newActivity, this._docPath, newActivity.cursorId);

    // Return next block
    return block;
  }
}
