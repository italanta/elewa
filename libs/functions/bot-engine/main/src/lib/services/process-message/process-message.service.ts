import { HandlerTools } from '@iote/cqrs';

import { isOperationBlock, isOutputBlock, StoryBlock, StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { Message } from '@app/model/convs-mgr/conversations/messages';
import { Cursor, isDoingSurvey } from '@app/model/convs-mgr/conversations/admin/system';
import { AssessmentQuestionBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { EndUser } from '@app/model/convs-mgr/conversations/chats';

import { ActiveChannel } from '../../model/active-channel.service';

import { NextBlockFactory } from '../next-block/next-block.factory';

import { CursorDataService } from '../data-services/cursor.service';
import { ConnectionsDataService } from '../data-services/connections.service';
import { BlockDataService } from '../data-services/blocks.service';
import { EnrolledUserDataService } from '../data-services/enrolled-user.service';
import { BotModuleDataService } from '../data-services/botmodules.service';
import { StoriesDataService } from '../data-services/stories.service';

import { BotMediaProcessService } from '../media/process-media-service';
import { ProcessInputFactory } from '../process-input/process-input.factory';
import { OperationBlockFactory } from '../process-operation-block/process-operation-block.factory';
import { assessUserAnswer } from '../process-operation-block/block-type/assess-user-answer';
import { SurveyService } from '../process-operation-block/block-type/survey-service';


export class ProcessMessageService
{
  isInputValid = true;
  sideOperations: Promise<unknown>[] = [];

  constructor(
    private _cursorService$: CursorDataService,
    private _connService$: ConnectionsDataService,
    private _blockService$: BlockDataService,
    private _tools: HandlerTools,
    private _activeChannel: ActiveChannel,
    private _processMediaService$: BotMediaProcessService,
  ) { }

  /**
   * If a chat session has not yet been recorded, we create a new one and return the first block
   */
  async getFirstBlock(tools: HandlerTools, orgId: string, currentStory: string)
  {
    /** Get the first Block */
    const firstBlock = await this._blockService$.getFirstBlock(orgId, currentStory);

    const newCursor: Cursor = {
      position: { storyId: currentStory, blockId: firstBlock.id }
    };

    return {
      nextBlock: firstBlock,
      newCursor: newCursor
    };
  }

  /**
   * Gets the next block and updates the cursor
   * @param chatInfo - The registered chat information of the end-user
   * @param chatBotRepo$ - Contains ready to use methods for working with the chatbot firebase collections
   * @param msg - The message sent by the end-user
   * @returns Next Block
   */
  async resolveNextBlock(msg: Message, currentCursor: Cursor, endUser: EndUser, orgId: string, currentStory: string, tools: HandlerTools)
  {
    this._tools.Logger.log(()=> `Resolving next block...`);

    let newCursor = currentCursor;

    // If the user is doing or has started a survey, temporarily interrupt the normal flow
    if(isDoingSurvey(currentCursor.surveyStack)) {
      return new SurveyService(this._blockService$, this._connService$, this._tools)
                .handleBlock(null, currentCursor, orgId, endUser, msg);
    }

    const lastBlock = await this._blockService$.getBlockById(currentCursor.position.blockId, orgId, currentStory);

    this._tools.Logger.log(()=> `Processing block: Last block: ${JSON.stringify(lastBlock)}}`);

    // Handle input: validates and saves the input to variable
    const inputPromise = this.processInput(msg, lastBlock, orgId, endUser);

    this.sideOperations.push(inputPromise);

    // upodate leaner progrress
    const updateLearnersProgressPromise = this._updateLearnerProgress(currentStory, lastBlock, endUser, tools, orgId);

    this.sideOperations.push(updateLearnersProgressPromise);

    // Return the cursor updated with the next block in the story
    newCursor = await this.__nextBlockService(currentCursor, lastBlock, orgId, currentStory, msg, endUser.id);

    // Update the cursor with the user score in the assessment
    if(lastBlock.type === StoryBlockTypes.AssessmentQuestionBlock) {
      const userAnswerScore = assessUserAnswer(lastBlock as AssessmentQuestionBlock, msg)
      newCursor.assessmentStack[0].score += userAnswerScore;
      newCursor.assessmentStack[0].maxScore += (lastBlock as AssessmentQuestionBlock).marks;
      
      this._tools.Logger.log(()=> `User score on question ${lastBlock.id}: ${userAnswerScore}`);
    }

    // Get the full block object here so that we can return it to the bot engine
    let nextBlock = await this._blockService$.getBlockById(newCursor.position.blockId, orgId, currentStory);

    // We check if the next block is a Structural Block so that we can handle it and find the next block
    //  to send back to the end user. Because we cannot send these types of blocks to the user, we
    //   need to send the blocks they are pointing to

    // Some of the blocks are not meant to be sent back to the end user, but perform specific actions

    this._tools.Logger.log(()=> `Next block: ${JSON.stringify(nextBlock)}`);

    while (nextBlock && isOperationBlock(nextBlock.type)) {
      const updatedPosition = await this.processOperationBlock(msg, nextBlock, newCursor, orgId, endUser);

      nextBlock = updatedPosition.storyBlock;
      newCursor = updatedPosition.newCursor;
    }

    // Return the resolved next block and the new cursor.
    return {
      nextBlock: nextBlock,
      newCursor
    };
  }

  /**
   * A cursor is a specific point in the story. We mark the cursor by saving the story block that we
   *  send back to the end user. So if we know the last block we sent to the user we will know their position 
   *   in the story.  
   * 
   * This method takes the latest cursor and determines the next block in the story.  
   * 
   * @returns NextBlock
   */
  private async __nextBlockService(currentCursor: Cursor, currentBlock: StoryBlock, orgId: string, currentStory: string, msg?: Message, endUserId?: string): Promise<Cursor>
  {
    let nextBlockService = new NextBlockFactory().resoveBlockType(currentBlock.type, this._tools, this._blockService$, this._connService$);

    const updatePosition = await nextBlockService.changedPath(msg, currentBlock, currentCursor, currentStory, orgId, this._blockService$);

    if(updatePosition) {
      currentCursor = updatePosition.cursor;
      currentBlock = updatePosition.lastBlock;
      currentStory = updatePosition.currentStory;

      nextBlockService =  new NextBlockFactory().resoveBlockType(currentBlock.type, this._tools, this._blockService$, this._connService$);
    }

    return nextBlockService.getNextBlock(msg, currentCursor, currentBlock, orgId, currentStory, endUserId);
  }

  private async processInput(msg: Message, lastBlock: StoryBlock, orgId: string, endUser: EndUser)
  {

    if (!isOutputBlock(lastBlock.type)) {

      const processInputFactory = new ProcessInputFactory(this._tools, this._activeChannel, this._processMediaService$);

      this.isInputValid = await processInputFactory.processInput(msg, lastBlock, orgId, endUser);

    }
  }

  private async processOperationBlock(msg: Message, nextBlock: StoryBlock, newCursor: Cursor, orgId: string, endUser: EndUser)
  {
    const processOperationBlock = new OperationBlockFactory(this._blockService$, this._connService$, this._tools, this._activeChannel).resolve(nextBlock.type);

    const updatedPosition = await processOperationBlock.handleBlock(nextBlock, newCursor, orgId, endUser, msg);

    const sideOperations = processOperationBlock.sideOperations;

    if (sideOperations && sideOperations.length > 0) this.sideOperations.push(...sideOperations);

    return updatedPosition;
  }

  /** update the enrolled user's progress with the just completed story(lesson's) details*/
  private async _updateLearnerProgress (currentStory: string, lastBlock:StoryBlock, endUser:EndUser, tools:HandlerTools, orgId:string) {
    const enrolledDataServ = new EnrolledUserDataService(tools, orgId);
    const botModDataService = new BotModuleDataService(tools, orgId);
    const storiesDataService = new StoriesDataService(tools, orgId);

    const enrolledUser = await enrolledDataServ.getEnrolledUser(endUser.enrolledUserId ?? '');

    const parentModule = (await storiesDataService.getStory(currentStory))?.parentModule;
    const parentCourse = (await botModDataService.getBotModule(parentModule))?.parentBot;

    if (!enrolledUser) return;

    if (enrolledUser.courses == null) enrolledUser.courses = [];

    // Find or create the course
    let theCourse = enrolledUser.courses.find(course => course.courseId === parentCourse);

    if (!theCourse) {
      theCourse = { courseId: parentCourse, modules: [] };
      enrolledUser.courses.push(theCourse);
    }

    // Find or create the module
    let theModule = theCourse.modules.find(mod => mod.moduleId === parentModule);

    if (!theModule) {
      theModule = { moduleId: parentModule, lessons: [] };
      theCourse.modules.push(theModule);
    }

    let theLesson = theModule.lessons.find(lesson => lesson.lessonId === currentStory);

    if (!theLesson) {
      theLesson = { lessonId: currentStory, blocks: [] };
      theModule.lessons.push(theLesson);
    }

    const block = theLesson.blocks.find((blockId) => blockId === lastBlock.id)
    if (!block) theLesson.blocks.push(lastBlock.id);

    tools.Logger.log(() => `Updating enrolled user progress for ${endUser.enrolledUserId}`);
    tools.Logger.log(() => `Current Story: ${currentStory}`);
    tools.Logger.log(() => `Parent Course: ${parentCourse}`);
    tools.Logger.log(() => `Parent Module: ${parentModule}`);
    tools.Logger.log(() => `Lesson: ${JSON.stringify(theLesson)}`);

    // Save changes
    await enrolledDataServ.updateEnrolledUser(enrolledUser);
  };

  public getSideOperations()
  {
    return this.sideOperations;
  }
}
