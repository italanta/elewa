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
 * When an end user gets to the end of the story we can either end the conversation or switch to the 
 *  next story based on the configuration.
 * 
 * @param nextBlock - The next block in the story to be sent back to the user
 * @param endUser - The information about the end user chatting with the bot
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
   * We get the next block in the storyline by using the values saved in the @type {JumpBlock}
   * 
   * @returns {StoryBlock}
   */
  async getNextBlock(msg: Message, lastBlock: JumpBlock, orgId: string, currentStory: string, endUserId: string): Promise<StoryBlock>
  {
    // Get the next block using the id. Connection.targetId == id of the next block
    const nextBlock = await this._blockDataService.getBlockById(lastBlock.targetBlockId, orgId, lastBlock.targetStoryId);

    await this._updateStory(lastBlock.targetStoryId, orgId, endUserId);

    // Increment the depth by 1 to indicate that we are a level deeper into the story
    nextBlock.storyDepth++;

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