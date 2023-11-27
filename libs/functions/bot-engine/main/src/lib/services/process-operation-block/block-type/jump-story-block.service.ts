import { HandlerTools, Logger } from "@iote/cqrs";

import { EndUser } from "@app/model/convs-mgr/conversations/chats";
import { JumpBlock } from "@app/model/convs-mgr/stories/blocks/messaging";

import { Cursor, EndUserPosition, RoutedCursor } from "@app/model/convs-mgr/conversations/admin/system";
import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";

import { BlockDataService } from "../../data-services/blocks.service";
import { ConnectionsDataService } from "../../data-services/connections.service";
import { IProcessOperationBlock } from "../models/process-operation-block.interface";


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
export class JumpStoryBlockService implements IProcessOperationBlock
{
  sideOperations: Promise<any>[] = [];
  userInput: string;
  _logger: Logger;

  constructor(private _blockDataService: BlockDataService, private _connDataService: ConnectionsDataService, private tools: HandlerTools)
  { }


  public async handleBlock(storyBlock: JumpBlock, updatedCursor: Cursor, orgId: string, endUser: EndUser) {
      
    const currentStory = updatedCursor.position.storyId;
    // 1. Get the connections pointing to block success or block fail blocks in the story
    // Then we use the connections to get the blocks id and construct our RoutedCursor

    // The jump block only has two options, one to use in case the child story is successful
    //  and another incase the story fails
    const blockSuccessSourceId = `i-0-${storyBlock.id}`;
    const blockFailSourceId = `i-1-${storyBlock.id}`;

    const blockSuccessConn = await this._connDataService.getConnByOption(blockSuccessSourceId, orgId, currentStory);

    this.tools.Logger.log(()=> `Block Success Connection: ${JSON.stringify(blockSuccessConn)}`);

    const blockFailConn = await this._connDataService.getConnByOption(blockFailSourceId, orgId, currentStory);

    let nextBlock: StoryBlock;
    // Get the next block by passing the blockId and the storyId and the blockId specified in the story.
    if (storyBlock.targetBlockId) {

      nextBlock = await this._blockDataService.getBlockById(storyBlock.targetBlockId, orgId, storyBlock.targetStoryId);
      
     }

     if(!storyBlock.targetBlockId || nextBlock === null) 
     {
      nextBlock  = await this._blockDataService.getFirstBlock(orgId, storyBlock.targetStoryId);
     }

    this.tools.Logger.log(()=> `Jumping to block: ${JSON.stringify(nextBlock)}`);

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
      storyId: currentStory,
      blockSuccess: blockSuccessConn ? blockSuccessConn.targetId : "",
      blockFail: blockFailConn ? blockFailConn.targetId : "",
    };

    // Update the EndUser 
    const newUserPosition: EndUserPosition = {
      storyId: storyBlock.targetStoryId,
      blockId: nextBlock.id
    };

    const newCursor = updatedCursor;

    // 3. Create new stack if it does not exist or 
    //  push the new routed cursor to the top existing stack
    if (!newCursor.parentStack) {
      const parentStack = [];
      parentStack.unshift(routedCursor);

      newCursor.parentStack = parentStack;
    } else {
      newCursor.parentStack.unshift(routedCursor);
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
}
