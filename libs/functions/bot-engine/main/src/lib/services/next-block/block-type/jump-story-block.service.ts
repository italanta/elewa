import { HandlerTools, Logger } from "@iote/cqrs";

import { EndUser } from "@app/model/convs-mgr/conversations/chats";
import { JumpBlock } from "@app/model/convs-mgr/stories/blocks/messaging";
import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";
import { Message } from "@app/model/convs-mgr/conversations/messages";

import { Cursor, EndUserPosition, RoutedCursor } from "@app/model/convs-mgr/conversations/admin/system";

import { BlockDataService } from "../../data-services/blocks.service";
import { ConnectionsDataService } from "../../data-services/connections.service";
import { EndUserDataService } from "../../data-services/end-user.service";

import { NextBlockService } from "../next-block.class";

import { CursorDataService } from "../../data-services/cursor.service";


/**
 * A subroutine is a conversational flow within another story. 
 * 
 * A JumpBlock enables a user to 'jump' to a specific story and block from another ongoing story.
 * 
 * Therefore this service updates the story and responds to the end user with the next block in the new story.
 * 
 * TODO: 
 *  - Add function to get the first block in the new story if the block is not provided
 *  - Add function to jump to the same story, if the story is not provided
 */
export class JumpStoryBlockService extends NextBlockService
{
  userInput: string;
  _logger: Logger;

  constructor(private _blockDataService: BlockDataService, private _connDataService: ConnectionsDataService, tools: HandlerTools)
  {
    super(tools);
    this.tools = tools;
  }

  /**
   * When a user hits a jump block we:
   *  1. Get the current cursor
   *  2. Create a RoutedCursor from the block configuration (based on next steps (success connection, fail connection, error config) 
   *      within the current story
   *  3. Push the RoutedCursor onto the parent stack 
   *  4. Update the current cursor to point to the new story and it's first block (the one connected to the starting block)
   * 
   * We get the next block in the storyline by using the targetStoryId and targetBlockId saved in the @type {JumpBlock}
   * 
   * TODO: 
   *  - Add function to get the first block in the new story if the block is not provided
   *  - Add function to jump to the same story, if the story is not provided
   */
  async getNextBlock(msg: Message, currentCursor: Cursor, currentBlock: JumpBlock, orgId: string, currentStory: string, endUserId: string): Promise<StoryBlock>
  {
    const cursorService = new CursorDataService(this.tools);

    // 1. Get the connections pointing to block success or block fail blocks in the story
    // Then we use the connections to get the blocks id and construct our RoutedCursor

    // The jump block only has two options, one to use in case the child story is successful
    //  and another incase the story fails
    const blockSuccessSourceId = `i-0-${currentBlock.id}`;
    const blockFailSourceId = `i-1-${currentBlock.id}`;

    const blockSuccessConn = await this._connDataService.getConnBySourceId(blockSuccessSourceId, orgId, currentStory);

    const blockFailConn = await this._connDataService.getConnBySourceId(blockFailSourceId, orgId, currentStory);

    // Get the next block by passing the blockId and the storyId and the blockId specified in the story.
    const nextBlock = await this._blockDataService.getBlockById(currentBlock.targetBlockId, orgId, currentBlock.targetStoryId);

    // 2. Create routed cursor
    const routedCursor: RoutedCursor = {
      storyId: currentBlock.targetStoryId,
      blockSuccess: blockSuccessConn.targetId,
      blockFail: blockFailConn.targetId,
    };

    // Update the EndUser 
    const newUserPosition: EndUserPosition = {
      storyId: currentBlock.targetStoryId,
      blockId: nextBlock.id
    };

    // 3. Create new stack if it does not exist or 
    //  push the new routed cursor to the top existing stack
    if (currentCursor.parentStack) {
      const parentStack = [];
      parentStack.unshift(routedCursor);

      currentCursor.parentStack = parentStack;
    } else {
      currentCursor.parentStack.push(routedCursor);
    }

    // 4. Update the current cursor
    const newCursor: Cursor = {
      ...currentCursor,
      position: newUserPosition
    };

    await cursorService.updateCursor(endUserId, orgId, newCursor);

    // Update the story if we have jumped to another one
    // TODO: Remove story from end user document and to fetch from cursor
    if (currentStory !== currentBlock.targetBlockId) await this._updateStory(currentBlock.targetStoryId, orgId, endUserId);


    return nextBlock;
  }

  /**
   * If a story id is set on the JumpBlock, then we need to switch the user to the next story.
   * 
   * This method updates the end user with the new story and returns the updated end user object
   * 
   * @returns {EndUser}
   */
  private async _updateStory(newStoryId: string, orgId: string, endUserId: string)
  {
    const endUserService = new EndUserDataService(this.tools, orgId);

    const endUser = await endUserService.getEndUser(endUserId);

    // Update the end user object with the new story
    const newUserStory: EndUser = {
      ...endUser,
      currentStory: newStoryId
    };

    return endUserService.updateEndUser(newUserStory);
  }
}