import { HandlerTools, Logger } from "@iote/cqrs";

import { EndUser } from "@app/model/convs-mgr/conversations/chats";
import { JumpBlock } from "@app/model/convs-mgr/stories/blocks/messaging";
import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";
import { Message } from "@app/model/convs-mgr/conversations/messages";

import { BlockDataService } from "../../data-services/blocks.service";
import { ConnectionsDataService } from "../../data-services/connections.service";
import { EndUserDataService } from "../../data-services/end-user.service";

import { NextBlockService } from "../next-block.class";

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
   * We get the next block in the storyline by using the targetStoryId and targetBlockId saved in the @type {JumpBlock}
   * 
   * @returns {StoryBlock}
   * 
   * TODO: 
   *  - Add function to get the first block in the new story if the block is not provided
   *  - Add function to jump to the same story, if the story is not provided
   */
  async getNextBlock(msg: Message, lastBlock: JumpBlock, orgId: string, currentStory: string, endUserId: string): Promise<StoryBlock>
  {
    // Get the next block by passing the blockId and the storyId and the blockId specified in the story.
    const nextBlock = await this._blockDataService.getBlockById(lastBlock.targetBlockId, orgId, lastBlock.targetStoryId);

    // Update the story if we have jumped to another one
    if (currentStory !== lastBlock.targetBlockId) await this._updateStory(lastBlock.targetStoryId, orgId, endUserId);

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