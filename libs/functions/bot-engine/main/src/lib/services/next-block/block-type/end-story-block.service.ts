import { HandlerTools, Logger } from "@iote/cqrs";

import { EndUser } from "@app/model/convs-mgr/conversations/chats";
import { EndStoryBlock } from "@app/model/convs-mgr/stories/blocks/messaging";
import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";

import { BlockDataService } from "../../data-services/blocks.service";
import { ConnectionsDataService } from "../../data-services/connections.service";


import { EndUserDataService } from "../../data-services/end-user.service";
import { saveMilestoneData } from "../../milestones/save-data.service";

/**
 * When an end user gets to the end of the story we can either end the conversation or switch to the 
 *  next story based on the configuration.
 * 
 * @param nextBlock - The next block in the story to be sent back to the user
 * @param endUser - The information about the end user chatting with the bot
 */
export class EndStoryBlockService
{
  userInput: string;
  _logger: Logger;
  tools: HandlerTools;

  constructor(private _blockDataService: BlockDataService, private _connDataService: ConnectionsDataService, tools: HandlerTools)
  {
    this.tools = tools;
  }

  /**
   * When a user gets to the end of the story we can either end the story or switch to the 
   *  next story based on the configuration.
   * 
   * @param nextBlock - The next block in the story to be sent back to the user
   * @param endUser - The information about the end user chatting with the bot
   */
  async endStory(nextBlock: StoryBlock, endUser: EndUser, orgId: string, endUserService: EndUserDataService)
  {
    const endStoryBlock = nextBlock as EndStoryBlock;

    // If a milestone is hit, we call an endpoint with the data collected from input blocks variables 
    if (endStoryBlock.milestone) await saveMilestoneData(endStoryBlock.postUrl, endUser.id, orgId, endStoryBlock.milestone, this.tools);
   
    // If a story id is set on the EndStoryBlock, then we need to switch the user to the next story.
    if (endStoryBlock.storyId) return this._switchStory(endStoryBlock, endUser, orgId, endUserService);
  }

  /**
   * If a story id is set on the EndStoryBlock, then we need to switch the user to the next story.
   * 
   * This method updates the end user with the new story and returns the first block of the new story
   * 
   * @returns FirstBlock
   */
  private async _switchStory(endStoryBlock: EndStoryBlock, endUser: EndUser, orgId: string, endUserService: EndUserDataService)
  {
    // Update the end user object with the new story
    const newUserStory: EndUser = {
      ...endUser,
      currentStory: endStoryBlock.storyId
    };

    await endUserService.updateEndUser(newUserStory);

    // Return the first block of the new story
    const conn = await this._connDataService.getFirstConnDiffStory(endStoryBlock.storyId);

    return this._blockDataService.getBlockById(conn.targetId, orgId, endStoryBlock.storyId);
  }
}