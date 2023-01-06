import { HandlerTools } from '@iote/cqrs';

import { Cursor } from '@app/model/convs-mgr/conversations/admin/system';
import { StoryBlock, StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
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
    const firstBlock = await this._blockService$.getFirstBlock(orgId, currentStory);

    return firstBlock;
  }

  /**
   * Gets the next block and updates the cursor
   * @param chatInfo - The registered chat information of the end-user
   * @param chatBotRepo$ - Contains ready to use methods for working with the chatbot firebase collections
   * @param msg - The message sent by the end-user
   * @returns Next Block
   */
  async resolveNextBlock(msg: Message, latestBlock: StoryBlock, endUserId: string, orgId: string, currentStory: string, tools: HandlerTools)
  {
    // Return the next block
    let nextBlock = await this.__nextBlockService(latestBlock, orgId, currentStory, msg, endUserId);

    // Make sure that the depth of the next block is synchronized by the depth of the story  
    if(nextBlock.storyDepth < latestBlock.storyDepth)
    {
      nextBlock.storyDepth = latestBlock.storyDepth
    }

    // 'Jump' the story if the next block is a JumpBlock
    if(nextBlock.type === StoryBlockTypes.JumpBlock) 
    {
      nextBlock = await this.__nextBlockService(nextBlock, orgId, currentStory, msg, endUserId);
    }

    return nextBlock
  }

  /**
   * A cursor is a specific point in the story. We mark the cursor by saving the story block that we
   *  send back to the end user. So if we know the last block we sent to the user we will know their position 
   *   in the story.  
   * 
   * This method takes the latest cursor and determines the next block in the story.  
   * 
   * @returns NextBlock
   */
  private async __nextBlockService(block: StoryBlock, orgId: string, currentStory: string, msg?: Message, endUserId?: string): Promise<StoryBlock>
  {
    const nextBlockService = new NextBlockFactory().resoveBlockType(block.type, this._tools, this._blockService$, this._connService$);

    return nextBlockService.getNextBlock(msg, block, orgId, currentStory, endUserId);
  }
}
