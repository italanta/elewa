import { HandlerTools, Logger } from "@iote/cqrs";

import { AssessmentBrick } from "@app/model/convs-mgr/stories/blocks/messaging";

import { AssessmentCursor, Cursor, EndUserPosition, RoutedCursor } from "@app/model/convs-mgr/conversations/admin/system";
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
export class AssessmentBlockService implements IProcessOperationBlock
{
  sideOperations: Promise<any>[] = [];
  userInput: string;
  _logger: Logger;

  constructor(private _blockDataService: BlockDataService, private _connDataService: ConnectionsDataService, private tools: HandlerTools)
  { }


  public async handleBlock(storyBlock: AssessmentBrick, updatedCursor: Cursor, orgId: string, endUserId: string)
  {

    const currentStory = updatedCursor.position.storyId;

    // 1. Get the connections pointing to block success or block fail blocks in the story
    // Then we use the connections to get the blocks id and construct our RoutedCursor

    // The jump block only has two options, one to use in case the child story is successful
    //  and another incase the story fails
    const failOption = `i-0-${storyBlock.id}`;
    const averageOption = `i-1-${storyBlock.id}`;
    const passOption = `i-2-${storyBlock.id}`;

    const failConn = await this._connDataService.getConnByOption(failOption, orgId, currentStory);
    const avrgConn = await this._connDataService.getConnByOption(averageOption, orgId, currentStory);
    const passConn = await this._connDataService.getConnByOption(passOption, orgId, currentStory);

    let nextBlock: StoryBlock;
    // Get the next block by passing the blockId and the storyId and the blockId specified in the story.

    if (storyBlock.assessmentId) {
      nextBlock = await this._blockDataService.getFirstBlock(orgId, storyBlock.assessmentId);
    }

    this.tools.Logger.log(() => `Jumping to assessment question: ${JSON.stringify(nextBlock)}`);

    // 2. Create assessment cursor
    const assessmentCursor: AssessmentCursor = {
      startedOn: new Date(),
      assessmentId: storyBlock.assessmentId,
      fail: failConn ? failConn.targetId : "",
      average: avrgConn ? avrgConn.targetId : "",
      pass: passConn ? passConn.targetId : "",
      score: 0
    };

    const routedCursor: RoutedCursor = {
      storyId: currentStory,
      blockSuccess: "",
      blockFail: "",
    };

    // Update the EndUser postion
    const newUserPosition: EndUserPosition = {
      storyId: storyBlock.assessmentId,
      blockId: nextBlock.id
    };

    let newCursor = updatedCursor;

    // 3. Create new stack if it does not exist or 
    //  push the new routed cursor to the top existing stack
    if (!newCursor.assessmentStack) {
      const assessmentStack = [];
      assessmentStack.unshift(assessmentCursor);

      newCursor.assessmentStack = assessmentStack;
    } else {
      newCursor.assessmentStack.unshift(assessmentCursor);
    }

    if (!newCursor.parentStack) {
      const parentStack = [];
      parentStack.unshift(routedCursor);

      newCursor.parentStack = parentStack;
    } else {
      newCursor.parentStack.unshift(routedCursor);
    }

    newCursor.position = newUserPosition;

    return {
      storyBlock: nextBlock,
      newCursor
    };
  }
}