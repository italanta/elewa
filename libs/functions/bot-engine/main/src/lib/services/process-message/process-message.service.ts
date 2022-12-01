import { HandlerTools } from '@iote/cqrs';

import { Cursor } from '@app/model/convs-mgr/conversations/admin/system';
import { StoryBlock } from '@app/model/convs-mgr/stories/blocks/main';
import { Message } from '@app/model/convs-mgr/conversations/messages';

import { NextBlockFactory } from '../next-block/next-block.factory';

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
  async getFirstBlock(tools: HandlerTools, orgId: string, currentStory: string)
  {
    /** Get the first Block */
    const connection = await this._connService$.getFirstConnFirstStory();

    let firstBlock: StoryBlock = await this._blockService$.getBlockById(connection.targetId, orgId, currentStory);

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
  async resolveNextBlock(msg: Message, endUserId: string, orgId: string, currentStory: string, tools: HandlerTools)
  {
    // const chatService =  new ChatBotService(tools.Logger, platform)

    // Get the latest activity / latest position of the cursor
    const latestCursor = (await this._cursorService$.getLatestCursor(endUserId, orgId)) as Cursor;

    // Get the last block found in cursor
    const latestBlock = latestCursor.currentBlock;

    if (latestCursor.futureBlock) {

      return latestCursor.futureBlock;

    } else {

      return this.__nextBlockService(latestBlock, orgId, currentStory, msg, endUserId);
    }
  }

  async resolveFutureBlock(currentBlock: StoryBlock, orgId: string, currentStory: string, msg?: Message, endUserId?: string)
  {
    return this.__nextBlockService(currentBlock, orgId, currentStory, msg, endUserId);
  }

  private async __nextBlockService(block: StoryBlock, orgId: string, currentStory: string, msg?: Message, endUserId?: string): Promise<StoryBlock>
  {
    const nextBlockService = new NextBlockFactory().resoveBlockType(block.type, this._tools, this._blockService$, this._connService$);

    return nextBlockService.getNextBlock(msg, block, orgId, currentStory, endUserId);

  }
}
