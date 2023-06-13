import { HandlerTools } from '@iote/cqrs';

import { isOperationBlock, isOutputBlock, StoryBlock, StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { Message } from '@app/model/convs-mgr/conversations/messages';
import { Cursor } from '@app/model/convs-mgr/conversations/admin/system';
import { ActiveChannel } from '@app/functions/bot-engine';

import { NextBlockFactory } from '../next-block/next-block.factory';

import { CursorDataService } from '../data-services/cursor.service';
import { ConnectionsDataService } from '../data-services/connections.service';
import { BlockDataService } from '../data-services/blocks.service';
import { ProcessInputFactory } from '../process-input/process-input.factory';

import { BotMediaProcessService } from '../media/process-media-service';
import { OperationBlockFactory } from '../process-operation-block/process-operation-block.factory';
import { assessUserAnswer } from '../process-operation-block/block-type/assess-user-answer';
import { AssessmentQuestionBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

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
  async resolveNextBlock(msg: Message, currentCursor: Cursor, endUserId: string, orgId: string, currentStory: string, tools: HandlerTools)
  {
    this._tools.Logger.log(()=> `Resolving next block...`);

    let newCursor = currentCursor;

    const lastBlock = await this._blockService$.getBlockById(currentCursor.position.blockId, orgId, currentStory);

    this._tools.Logger.log(()=> `Processing block: Last block: ${JSON.stringify(lastBlock)}}`);

    // Handle input: validates and saves the input to variable
    const inputPromise = this.processInput(msg, lastBlock, orgId, endUserId);

    this.sideOperations.push(inputPromise);

    // Return the cursor updated with the next block in the story
    newCursor = await this.__nextBlockService(currentCursor, lastBlock, orgId, currentStory, msg, endUserId);

    // Update the cursor with the user score in the assessment
    if(lastBlock.type === StoryBlockTypes.QuestionBlock) {
      const userAnswerScore = assessUserAnswer(lastBlock as AssessmentQuestionBlock, msg)
      newCursor.assessmentStack[0].score += userAnswerScore;
      
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
      const updatedPosition = await this.processOperationBlock(msg, nextBlock, newCursor, orgId, endUserId);

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
    const nextBlockService = new NextBlockFactory().resoveBlockType(currentBlock.type, this._tools, this._blockService$, this._connService$);

    return nextBlockService.getNextBlock(msg, currentCursor, currentBlock, orgId, currentStory, endUserId);
  }

  private async processInput(msg: Message, lastBlock: StoryBlock, orgId: string, endUserId: string)
  {

    if (!isOutputBlock(lastBlock.type)) {

      const processInputFactory = new ProcessInputFactory(this._tools, this._activeChannel, this._processMediaService$);

      this.isInputValid = await processInputFactory.processInput(msg, lastBlock, orgId, endUserId);

    }
  }

  private async processOperationBlock(msg: Message, nextBlock: StoryBlock, newCursor: Cursor, orgId: string, endUserId: string)
  {
    const processOperationBlock = new OperationBlockFactory(this._blockService$, this._connService$, this._tools).resolve(nextBlock.type);

    const updatedPosition = await processOperationBlock.handleBlock(nextBlock, newCursor, orgId, endUserId, msg);

    const sideOperations = processOperationBlock.sideOperations;

    if (sideOperations && sideOperations.length > 0) this.sideOperations.push(...sideOperations);

    return updatedPosition;
  }

  public getSideOperations()
  {
    return this.sideOperations;
  }
}
