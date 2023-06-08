import { HandlerTools, Logger } from "@iote/cqrs";

import { AssessmentQuestionBlock } from "@app/model/convs-mgr/stories/blocks/messaging";

import { AssessmentCursor, Cursor } from "@app/model/convs-mgr/conversations/admin/system";
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
export class AssessmentQuestionBlockService implements IProcessOperationBlock
{
  sideOperations: Promise<any>[] = [];
  userInput: string;
  _logger: Logger;

  constructor(private _blockDataService: BlockDataService, private _connDataService: ConnectionsDataService, private tools: HandlerTools)
  { }


  public async handleBlock(storyBlock: AssessmentQuestionBlock, updatedCursor: Cursor, orgId: string, endUserId: string)
  {
    let nextBlock: StoryBlock;
    let newCursor: Cursor;

    nextBlock = storyBlock;
    newCursor = updatedCursor;

    // If we have reached the end of the assessment, get the next block in the story
    if (!updatedCursor.position.blockId) {
      // Get the next block after the assessment depending on the score
      const currentAssessment = updatedCursor.assessmentStack[0];

      // Set the finishedOn date
      currentAssessment.finishedOn = new Date();

      const nextBlockId = await this.getNextBlockIdByScore(currentAssessment);

      // Pop the RoutedCursor at the top of the stack
      const topRoutineCursor = updatedCursor.parentStack.shift();

      nextBlock = await this._blockDataService.getBlockById(nextBlockId, orgId, topRoutineCursor.storyId);
      
      newCursor.assessmentStack[0] = currentAssessment;
      newCursor.position.blockId = nextBlockId;
      newCursor.position.storyId = updatedCursor.position.storyId;
      newCursor.parentStack = updatedCursor.parentStack;
    }

    return {
      storyBlock: nextBlock,
      newCursor
    };
  }

  /** 
   * Match assessment score to get Id of the next block 
   * 
   * TODO: Get block dynamically using the score with the provided inputs on the assessment brick 
  */
  private async getNextBlockIdByScore(assessmentCursor: AssessmentCursor)
  {
    const finalScore = assessmentCursor.score;
    if (finalScore > 0 && finalScore < 50) {
      // Get the next block after the assessment depending on the score
      return assessmentCursor.fail;
    } else if (finalScore >= 50 && finalScore <= 75) {
      return assessmentCursor.average;
    } else {
      return assessmentCursor.pass;
    }
  }
}