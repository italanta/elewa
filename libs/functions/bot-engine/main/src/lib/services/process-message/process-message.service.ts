import { HandlerTools } from '@iote/cqrs';

import { NextBlockFactory } from '../next-block/next-block.factory';

import { Cursor } from '@app/model/convs-mgr/conversations/admin/system';
import { Block } from '@app/model/convs-mgr/conversations/chats';
import { BaseMessage } from '@app/model/convs-mgr/conversations/messages';
import { CursorDataService } from '../data-services/cursor.service';
import { ConnectionsDataService } from '../data-services/connections.service';
import { BlockDataService } from '../data-services/blocks.service';

export class ProcessMessageService {
  constructor(
    private _cursorService$: CursorDataService,
    private _connService$: ConnectionsDataService,
    private _blockService$: BlockDataService
  ) {}

  /**
   * If a chat session has not yet been recorded, we create a new one and return the first block
   */
  async getFirstBlock(tools: HandlerTools) {
    /** Get the first Block */
    const connection = await this._connService$.getFirstConn();

    let firstBlock: Block = await this._blockService$.getBlockById(connection.targetId);

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
  async resolveNextBlock(msg: BaseMessage, tools: HandlerTools) {
    // const chatService =  new ChatBotService(tools.Logger, platform)

    // Get the latest activity / latest position of the cursor
    const latestCursor = (await this._cursorService$.getLatestCursor()) as Cursor;

    // Get the lastest block found in activity
    const latestBlock = latestCursor.block

    // Use NextBlockFactory to resolve the block type and get the next block based on the type
    const nextBlockService = new NextBlockFactory().resoveBlockType(latestBlock.type, tools, this._blockService$, this._connService$);
    const nextBlock = await nextBlockService.getNextBlock(msg, latestBlock);

    // Handles possible race condition
    // const duplicateMessage = await chatService.handleDuplicates(msg, tools)

    return nextBlock;
  }
}
