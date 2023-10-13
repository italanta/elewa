import { HandlerTools, Logger } from "@iote/cqrs";

import { QuestionMessageBlock } from "@app/model/convs-mgr/stories/blocks/messaging";
import { Cursor, EndUserPosition } from "@app/model/convs-mgr/conversations/admin/system";
import { Message, QuestionMessage } from "@app/model/convs-mgr/conversations/messages";
import { EndUser } from "@app/model/convs-mgr/conversations/chats";
import { QuestionResponses, SurveyResults } from "@app/model/convs-mgr/learners";

import { BlockDataService } from "../../data-services/blocks.service";
import { ConnectionsDataService } from "../../data-services/connections.service";
import { IProcessOperationBlock } from "../models/process-operation-block.interface";
import { EnrolledUserDataService } from "../../data-services/enrolled-user.service";
import { MessageTypes } from "@app/model/convs-mgr/functions";


export class SurveyService implements IProcessOperationBlock
{
  sideOperations: Promise<any>[] = [];
  userInput: string;
  _logger: Logger;

  constructor(private _blockDataService: BlockDataService, private _connDataService: ConnectionsDataService, private tools: HandlerTools)
  { }

  public async handleBlock(storyBlock: QuestionMessageBlock, currentCursor: Cursor, orgId: string, endUser: EndUser,  message?: Message)
  {
    let nextBlock: QuestionMessageBlock;
    let currentSurvey = currentCursor.surveyStack[0]
    const surveyId = currentSurvey.surveyId;

    // 2. Mark the start of the survey
    if(!currentSurvey.startedOn) {
      currentSurvey = {
        ...currentSurvey,
        startedOn: new Date()
      }
    }

    // Update the question response
    if(message.type == MessageTypes.QUESTION) {
      currentSurvey = this.__updateResults(currentSurvey as SurveyResults, currentCursor.position.blockId, message);
    }

    if(!currentCursor.position.blockId) {
      // Get the first block
      nextBlock = await this._blockDataService.getFirstBlock(orgId, surveyId);
    } else {
      // Get connection from the block updated on the cursor
      const conn = await this._connDataService.getConnBySourceId(currentCursor.position.blockId, orgId, surveyId);
  
      // Get block
      nextBlock = await this._blockDataService.getBlockById(conn.targetId, orgId, surveyId);
    }
    
    // Update the EndUser postion
    let newUserPosition: EndUserPosition = {
      storyId: surveyId,
      blockId: nextBlock.id
    };
    
    // If the survey has ended, we return the user to where they were before
    if(nextBlock.id == 'end-survey') {
      newUserPosition = currentSurvey.savedUserPosition;
      
      
      // Get the details of the last block which was sent to the user before the survey
      nextBlock = await this._blockDataService.getBlockById(newUserPosition.blockId, orgId, newUserPosition.storyId);
      
      // Update the enrolled user with the survey results
      const enrolledUserService = new EnrolledUserDataService(this.tools, orgId);
      
      const enrolledUser = (await enrolledUserService.getEnrolledUserByEndUser(endUser.id))[0];
      const results = currentSurvey as SurveyResults;
      
      if(!enrolledUser.surveyResults) {
        enrolledUser.surveyResults = [results];
      } else {
        enrolledUser.surveyResults.push(results);
      }
      
      // Update the end user document
      await enrolledUserService.updateEnrolledUser(enrolledUser);

      // Mark the end of the survey
      currentSurvey.finishedOn = new Date();
    }

    // Update cursor position 
    currentCursor.position = newUserPosition;

    // Update the current survey on the cursor
    currentCursor.surveyStack[0] = currentSurvey;

    return {
      nextBlock,
      newCursor: currentCursor
    };
  }

  private __updateResults(currentSurvey: SurveyResults, questionId: string, response: QuestionMessage) {
    const questionResponse: QuestionResponses = {
      questionId,
      reponseId:response.options[0].optionId
    }
    if(!currentSurvey.questions) {
      currentSurvey.questions = [questionResponse];
    } else {
      currentSurvey.questions.push(questionResponse);
    }

    return currentSurvey;
  }
}