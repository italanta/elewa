import * as _ from "lodash";

import { HandlerTools } from "@iote/cqrs";

import { Message, QuestionMessage } from "@app/model/convs-mgr/conversations/messages";
import { StoryBlock, StoryBlockTypes } from "@app/model/convs-mgr/stories/blocks/main";
import { ErrorMessageBlock } from "@app/model/convs-mgr/stories/blocks/messaging";
import { Cursor } from "@app/model/convs-mgr/conversations/admin/system";

import { BlockDataService } from "../data-services/blocks.service";

export abstract class NextBlockService
{

  tools: HandlerTools;
  constructor(tools: HandlerTools)
  {
    this.tools = tools;
  }

  /**
   * Default method that returns the block connected to the default option of the block
   * Applies for blocks which only have one target block e.g. Text Message Block
   * @returns StoryBlock
   */
  abstract getNextBlock(msg: Message, currentCursor: Cursor, currentBlock: StoryBlock, orgId: string, currentStory: string, endUserId?: string): Promise<Cursor>;

  protected getErrorBlock(blockId: string, errorMessage: string): StoryBlock
  {
    const block: ErrorMessageBlock = {
      id: blockId,
      type: StoryBlockTypes.ErrorBlock,
      position: null,
      deleted: false,
      blockTitle: '',
      blockIcon: '',
      message: errorMessage,
    };

    return block;

  }

  async changedPath(msg: Message, lastBlock: StoryBlock, currentCursor: Cursor, currentStory: string, orgId: string, blockDataService: BlockDataService) 
  {
    const cursor = currentCursor;

    const response = msg as QuestionMessage;

    if (!msg || !response.options) {
      return null;
    }

    const blockIdFromOptions = response.options[0].optionId.split("-")[0];

    this.tools.Logger.log(()=> `[MultipleOptionsMessageService].getNextBlock - Block id is ${lastBlock.id} and option block id is ${blockIdFromOptions}`);

    if (lastBlock.id === blockIdFromOptions.trim()) {
      return null;
    }

    this.tools.Logger.log(() => `[MultipleOptionsMessageService].getNextBlock - Previous block option clicked. Rerouting the user to that block...`);
    lastBlock = await blockDataService.getBlockById(blockIdFromOptions, orgId, currentStory);

    // If the block clicked is not in the current story,
    // 	We look for it in previously visited stories by the user.
    if (!lastBlock) {
      // Get previous stories the user has already done and
      //	make the array unique incase they jumped to the story twice.
      const prevRoutedCursors = _.uniqBy(cursor.parentStack, 'storyId');

      // Search for the block in each story and
      // 	stop loop if found
      // 
      // TODO: To avoid bugs we need to change the generated ID of blocks to be 
      //	unique universally for this to work
      for (let rtCursor of prevRoutedCursors) {
        const block = await blockDataService.getBlockById(blockIdFromOptions, orgId, rtCursor.storyId);

        if (block) {
          lastBlock = block;
          // Update the story to the one we've found the block in.
          currentStory = rtCursor.storyId;
          // Add this routed cursor to the top of the stack
          cursor.parentStack.unshift(rtCursor);
          break;
        }
      }
    }

    return {
      cursor,
      lastBlock,
      currentStory
    };
  }
}
