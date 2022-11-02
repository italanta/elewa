import { Handler, HandlerTools } from '@iote/cqrs';

import { NextBlockFactory } from '../next-block/next-block.factory';

import { Cursor } from '@app/model/convs-mgr/conversations/admin/system';
import { StoryBlock, StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { Message } from '@app/model/convs-mgr/conversations/messages';

import { CursorDataService } from '../data-services/cursor.service';
import { ConnectionsDataService } from '../data-services/connections.service';
import { BlockDataService } from '../data-services/blocks.service';


export class ProcessMessageService
{
  constructor(
    private _cursorService$: CursorDataService,
    private _connService$: ConnectionsDataService,
    private _blockService$: BlockDataService,
    private _tools: HandlerTools
  ) { }

  /**
   * If a chat session has not yet been recorded, we create a new one and return the first block
   */
  async getFirstBlock(tools: HandlerTools)
  {
    /** Get the first Block */
    const connection = await this._connService$.getFirstConn();

    let firstBlock: StoryBlock = await this._blockService$.getBlockById(connection.targetId);

    tools.Logger.log(() => `[ChatBotService].init - Updated Cursor`);

    return firstBlock;
  }

  /**
   * Gets the next block and updates the cursor
   * @param chatInfo - The registered chat information of the end-user
   * @param chatBotRepo$ - Contains ready to use methods for working with the chatbot firebase collections
   * @param msg - The message sent by the end-user
   * @returns Next Block
   */
  async resolveNextBlock(msg: Message, endUserId: string, orgId: string, tools: HandlerTools)
  {
    // const chatService =  new ChatBotService(tools.Logger, platform)

    // Get the latest activity / latest position of the cursor
    const latestCursor = (await this._cursorService$.getLatestCursor(endUserId, orgId)) as Cursor;

    // Get the last block found in cursor
    const latestBlock = latestCursor.currentBlock

    if(latestCursor.futureBlock) {

      return latestCursor.futureBlock

    } else {
      
      return this.__nextBlockService(latestBlock, msg)
    }
  }

  async resolveFutureBlock(currentBlock: StoryBlock ,msg?: Message)
  {
    return this.__nextBlockService(currentBlock, msg)
  }

  private async __nextBlockService(block: StoryBlock, msg?: Message): Promise<StoryBlock>
  {
    const nextBlockService =  new NextBlockFactory().resoveBlockType(block.type, this._tools, this._blockService$, this._connService$);

    return nextBlockService.getNextBlock(msg, block);

  }
}
