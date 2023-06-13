import { HandlerTools } from "@iote/cqrs";

import { EndStoryAnchorBlock } from "@app/model/convs-mgr/stories/blocks/messaging";
import { AssessmentCursor, Cursor } from "@app/model/convs-mgr/conversations/admin/system";

import { BlockDataService } from "../../data-services/blocks.service";
import { ConnectionsDataService } from "../../data-services/connections.service";

import { IProcessOperationBlock } from "../models/process-operation-block.interface";
import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";

/**
 * When an end user gets to the end of the story we can either end the conversation(return null) or 
 *  in case of a child story, return the success block (success state).
 */
export class EndStoryBlockService implements IProcessOperationBlock
{
  sideOperations: Promise<any>[];
  
  constructor(private _blockDataService: BlockDataService, private _connDataService: ConnectionsDataService, private tools: HandlerTools)
  { }

  /**
   * When a user hits the end story block in a child story, we: 
   *  1. Pop the RoutedCursor at the top of the stack
   *  2. Use the RoutedCursor to construct a new cursor from @see RoutedCursor.blockSuccess
   *  3. Update the cursor
   *  4. Resolve and return the success block
   */
  async handleBlock(storyBlock: EndStoryAnchorBlock, currentCursor: Cursor, orgId: string, endUserId: string)
  {
    const cursor = currentCursor;
    let nextBlock: StoryBlock;
    let newCursor: Cursor;
    let nextBlockId: string;

    /** If the parent stack is not empty, then we are in a child story */
    if (currentCursor.parentStack.length > 0) {
      // Pop the RoutedCursor at the top of the stack
      const topRoutineCursor = cursor.parentStack.shift();

      const topRoutineStoryId = topRoutineCursor.storyId;
      nextBlockId = topRoutineCursor.blockSuccess;

      // Use the RoutedCursor to construct a new cursor
      newCursor = {
        position: { storyId: topRoutineStoryId, blockId: nextBlockId },
        parentStack: currentCursor.parentStack

      };

      // If it's the end of an assessment, we need to get the next block based on the score
      if (storyBlock.id === "end-assessment" && currentCursor.assessmentStack.length > 0) {

        this.tools.Logger.log(() => `End of assessment: ${currentCursor.assessmentStack[0].assessmentId}`);

        // Get the next block after the assessment depending on the score
        const currentAssessment = currentCursor.assessmentStack[0];
  
        // Set the finishedOn date
        currentAssessment.finishedOn = new Date();
  
        nextBlockId = await this.getNextBlockIdByScore(currentAssessment);
        
        newCursor.assessmentStack[0] = currentAssessment;
        newCursor.position.blockId = nextBlockId;
      }

      // Resolve and return the success block
      nextBlock = await this._blockDataService.getBlockById(nextBlockId, orgId, topRoutineStoryId);

      return {
        storyBlock: nextBlock,
        newCursor
      }
    } else {
      // We return null when we hit the end of the parent story.
      // TODO: To implement handling null in the bot engine once refactor on PR#210 is approved.
      return null;
    }
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