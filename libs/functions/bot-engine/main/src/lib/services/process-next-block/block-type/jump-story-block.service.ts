import { HandlerTools, Logger } from "@iote/cqrs";

import { EndUser } from "@app/model/convs-mgr/conversations/chats";
import { JumpBlock } from "@app/model/convs-mgr/stories/blocks/messaging";

import { Cursor, EndUserPosition, RoutedCursor } from "@app/model/convs-mgr/conversations/admin/system";
import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";

import { BlockDataService } from "../../data-services/blocks.service";
import { ConnectionsDataService } from "../../data-services/connections.service";
import { EndUserDataService } from "../../data-services/end-user.service";
import { IProcessNextBlock } from "../models/process-next-block.interface";


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
export class JumpStoryBlockService implements IProcessNextBlock
{
  sideOperations: Promise<any>[] = [];
  userInput: string;
  _logger: Logger;

  constructor(private _blockDataService: BlockDataService, private _connDataService: ConnectionsDataService, private tools: HandlerTools)
  { }


  public async handleBlock(storyBlock: JumpBlock, updatedCursor: Cursor, orgId: string, endUserId: string) {
      
    const currentStory = updatedCursor.position.storyId;
    
    // 1. Get the connections pointing to block success or block fail blocks in the story
    // Then we use the connections to get the blocks id and construct our RoutedCursor

    // The jump block only has two options, one to use in case the child story is successful
    //  and another incase the story fails
    const blockSuccessSourceId = `i-0-${storyBlock.id}`;
    const blockFailSourceId = `i-1-${storyBlock.id}`;

    const blockSuccessConn = await this._connDataService.getConnByOption(blockSuccessSourceId, orgId, currentStory);

    const blockFailConn = await this._connDataService.getConnByOption(blockFailSourceId, orgId, currentStory);

    let nextBlock: StoryBlock;
    // Get the next block by passing the blockId and the storyId and the blockId specified in the story.

    nextBlock  = await this._blockDataService.getFirstBlock(orgId, storyBlock.targetStoryId);

    // if(!storyBlock.targetBlockId) {
    //   console.log('No target block id');
     

    // } else if(!storyBlock.targetStoryId){
    //   console.log('No target story id')
    //   if(storyBlock.targetBlockId) {
    //     console.log('Target block id');
    //     nextBlock = await this._blockDataService.getBlockById(storyBlock.targetBlockId, orgId, currentStory);
    //   } else {
    //     console.log('No target block id')
    //     nextBlock = await this._blockDataService.getFirstBlock(orgId, currentStory);
    //   }

    // } else {
    //   nextBlock = await this._blockDataService.getBlockById(storyBlock.targetBlockId, orgId, storyBlock.targetStoryId);
    // }

    // 2. Create routed cursor
    const routedCursor: RoutedCursor = {
      storyId: storyBlock.targetStoryId,
      blockSuccess: blockSuccessConn.targetId,
      // blockFail: blockFailConn.targetId,
    };

    // Update the EndUser 
    const newUserPosition: EndUserPosition = {
      storyId: storyBlock.targetStoryId,
      blockId: nextBlock.id
    };

    let newCursor = updatedCursor;

    // 3. Create new stack if it does not exist or 
    //  push the new routed cursor to the top existing stack
    if (!newCursor.parentStack) {
      const parentStack = [];
      parentStack.unshift(routedCursor);

      newCursor.parentStack = parentStack;
    } else {
      newCursor.parentStack.push(routedCursor);
    }

    newCursor.position = newUserPosition;

    // Update the story if we have jumped to another one
    // TODO: Remove story from end user document and to fetch from cursor
    // if (currentStory !== storyBlock.targetBlockId) await this._updateStory(storyBlock.targetStoryId, orgId, endUserId);

    return {
      storyBlock: nextBlock,
      newCursor
    };
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