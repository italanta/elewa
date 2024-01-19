import { HandlerTools } from "@iote/cqrs";

import { EndStoryAnchorBlock } from "@app/model/convs-mgr/stories/blocks/messaging";
import { AssessmentCursor, AssessmentResult, Cursor } from "@app/model/convs-mgr/conversations/admin/system";
import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";
import { EndUser } from "@app/model/convs-mgr/conversations/chats";

import { BlockDataService } from "../../data-services/blocks.service";
import { ConnectionsDataService } from "../../data-services/connections.service";

import { IProcessOperationBlock } from "../models/process-operation-block.interface";
import { EndUserDataService } from "../../data-services/end-user.service";
import { BotModuleDataService } from "../../data-services/botmodules.service";
import { CoursesDataService } from "../../data-services/courses.service";
import { EnrolledUserDataService } from "../../data-services/enrolled-user.service";
import { StoriesDataService } from "../../data-services/stories.service";

/**
 * When an end user gets to the end of the story we can either end the conversation(return null) or 
 *  in case of a child story, return the success block (success state).
 */
export class EndStoryBlockService implements IProcessOperationBlock
{
  sideOperations: Promise<any>[] = [];
  
  constructor(private _blockDataService: BlockDataService, private _connDataService: ConnectionsDataService, private tools: HandlerTools)
  { }

  /**
   * When a user hits the end story block in a child story, we: 
   *  1. Pop the RoutedCursor at the top of the stack
   *  2. Use the RoutedCursor to construct a new cursor from @see RoutedCursor.blockSuccess
   *  3. Update the cursor
   *  4. Resolve and return the success block
   */
  async handleBlock(storyBlock: EndStoryAnchorBlock, currentCursor: Cursor, orgId: string, endUser: EndUser)
  {
    const cursor = currentCursor;
    let nextBlock: StoryBlock;
    let newCursor: Cursor;
    let nextBlockId: string;

    const currentStory = currentCursor.position.storyId;

    /** If the parent stack is not empty, then we are in a child story */
    if (currentCursor.parentStack.length > 0) {
      // Pop the RoutedCursor at the top of the stack
      const topRoutineCursor = cursor.parentStack.shift();

      const topRoutineStoryId = topRoutineCursor.storyId;
      nextBlockId = topRoutineCursor.blockSuccess;

      // Use the RoutedCursor to construct a new cursor
      newCursor = {
        ...currentCursor,
        position: { storyId: topRoutineStoryId, blockId: nextBlockId },
        parentStack: currentCursor.parentStack,
      };

      // If it's the end of an assessment, we need to get the next block based on the score
      if (storyBlock.id === "end-assessment" && currentCursor.assessmentStack.length > 0) {

        this.tools.Logger.log(() => `End of assessment: ${currentCursor.assessmentStack[0].assessmentId}`);

        // Get the next block after the assessment depending on the score
        const currentAssessment = currentCursor.assessmentStack[0];

        const totalScore = currentAssessment.score;

        const endUserService = new EndUserDataService(this.tools, orgId);

        // Get percetage score of the end user in the assessment
        const finalPercentage = (currentAssessment.maxScore == 0 ? 0 : (totalScore/currentAssessment.maxScore)) * 100;

        // Get the assessment result and write it to the end user object
        const assessmentResult: AssessmentResult = {
          assessmentId: currentAssessment.assessmentId,
          percentage: finalPercentage,
          totalScore: totalScore,
          startedOn: currentAssessment.startedOn,
          finishedOn: new Date(),
        }

        if (endUser.assessmentResults) {
          endUser.assessmentResults.push(assessmentResult);
        } else {
          endUser.assessmentResults = [assessmentResult];
        }

        await endUserService.updateEndUser(endUser);

        nextBlockId = await this.getNextBlockIdByScore(currentAssessment);
        
        newCursor.assessmentStack[0] = currentAssessment;
        newCursor.position.blockId = nextBlockId;
      }

      // Resolve and return the success block
      nextBlock = await this._blockDataService.getBlockById(nextBlockId, orgId, topRoutineStoryId);

      // Update user course completion status
      const courseCompletion = this._updateCourseCompletion(orgId, endUser, currentStory);
      this.sideOperations.push(courseCompletion);

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
      // Get the final score of the user in the assessment
      const finalScore = assessmentCursor.score;

      // Get the percentage of the final score
      const finalPercentage = (assessmentCursor.maxScore == 0 ? 0 : (finalScore/assessmentCursor.maxScore)) * 100;

      this.tools.Logger.log(() => `Final score: ${finalScore} - Final percentage: ${finalPercentage}%`);

      // Return the correct block id based on the score
      if (finalPercentage >= 0 && finalPercentage < 50) {
        // Get the next block after the assessment depending on the score
        return assessmentCursor.fail;
      } else if (finalPercentage >= 50 && finalPercentage <= 75) {
        return assessmentCursor.average;
      } else {
        return assessmentCursor.pass;
      }
    }

    private async _updateCourseCompletion(orgId: string, endUser: EndUser, currentStory: string) 
    {
      const enrolledDataServ = new EnrolledUserDataService(this.tools, orgId);
      const botModDataService = new BotModuleDataService(this.tools, orgId);
      const storiesDataService = new StoriesDataService(this.tools, orgId);
      const botDataService = new CoursesDataService(this.tools, orgId);
    
      const enrolledUser = await enrolledDataServ.getEnrolledUser(endUser.enrolledUserId ?? '');
    
      const story = await storiesDataService.getStory(currentStory);
      const parentModule = await botModDataService.getBotModule(story.parentModule);

      // TODO: The bot should be a common value in the bot engine
      //  This should be fetched from the channel property 'linkedBot' once the publish
      //    feature has been implemented.
      const activeBot = await botDataService.getBot(parentModule.parentBot);

      // Total number of stories in the whole course/bot
      let numOfStories = 0;

      for (const moduleId of activeBot.modules) {
        const module = await botModDataService.getBotModule(moduleId);
        numOfStories += module.stories.length;
      }

      // Find the current course/bot they are doing
      // const currentCourse = enrolledUser.courses.find((courses)=> courses.courseId === bot.id);
      const currentCourse = enrolledUser.courses[enrolledUser.courses.length-1];
      
      if(currentCourse.courseId === activeBot.id) {
        // Total number of stories the learner has done
        let numOfStoriesComplete = 0;

        currentCourse.modules.forEach((module)=> numOfStoriesComplete += module.lessons.length);
      
      // If the learner has done all the stories it means
      //  that they have completed the course. So we push it
      //    to the array of completed courses.
      if(numOfStories == numOfStoriesComplete) {
        if(enrolledUser.completedCourses) {
          enrolledUser.completedCourses.unshift(activeBot.id);
        } else {
          enrolledUser.completedCourses = [activeBot.id];
        }
      }

      currentCourse.completion = `${numOfStoriesComplete}/${numOfStories}`;

      enrolledUser.courses[enrolledUser.courses.length-1] = currentCourse;

      await enrolledDataServ.updateEnrolledUser(enrolledUser);
      
      } else {
        this.tools.Logger.warn(()=> `[EndStoryBlockService] - User current course does not match active course(bot)!`)
      }
      
    }
}