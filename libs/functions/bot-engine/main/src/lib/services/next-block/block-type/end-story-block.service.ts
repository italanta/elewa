import { HandlerTools, Logger } from "@iote/cqrs";

import { EndStoryBlock } from "@app/model/convs-mgr/stories/blocks/messaging";
import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";
import { Cursor } from "@app/model/convs-mgr/conversations/admin/system";
import { Message } from "@app/model/convs-mgr/conversations/messages";

import { BlockDataService } from "../../data-services/blocks.service";
import { ConnectionsDataService } from "../../data-services/connections.service";

import { NextBlockService } from "../next-block.class";

import { CursorDataService } from "../../data-services/cursor.service";

/**
 * When an end user gets to the end of the story we can either end the conversation(return null) or 
 *  in case of a child story, return the success block (success state).
 */
export class EndStoryBlockService extends NextBlockService
{
  userInput: string;
  _logger: Logger;
  tools: HandlerTools;

  constructor(private _blockDataService: BlockDataService, private _connDataService: ConnectionsDataService, tools: HandlerTools)
  {
    super(tools);
    this.tools = tools;
  }

  /**
   * When a user hits the end story block in a child story, we: 
   *  1. Pop the RoutedCursor at the top of the stack
   *  2. Use the RoutedCursor to construct a new cursor from @see RoutedCursor.blockSuccess
   *  3. Update the cursor
   *  4. Resolve and return the success block
   */
  async getNextBlock(msg: Message, currentCursor: Cursor, currentBlock: EndStoryBlock, orgId: string, currentStory: string, endUserId?: string): Promise<StoryBlock>
  {
    const cursorService = new CursorDataService(this.tools);

    const cursor = currentCursor;

    /** If the parent stack is not empty, then we are in a child story */
    if (!currentCursor.parentStack.isEmpty()) {
      // Pop the RoutedCursor at the top of the stack
      const topRoutineCursor = cursor.parentStack.pop();

      const topRoutineStoryId = topRoutineCursor.storyId;
      const topRoutineBlockSuccess = topRoutineCursor.blockSuccess;

      // Use the RoutedCursor to construct a new cursor
      const newCursor: Cursor = {
        position: { storyId: topRoutineStoryId, blockId: topRoutineBlockSuccess },
        parentStack: currentCursor.parentStack

      };
      // Update the cursor
      await cursorService.updateCursor(endUserId, orgId, newCursor);

      // Resolve and return the success block
      const nextBlock = await this._blockDataService.getBlockById(topRoutineBlockSuccess, orgId, currentStory);

      return nextBlock;
    } else {
      // We return null when we hit the end of the parent story.
      // TODO: To implement handling null in the bot engine once refactor on PR#210 is approved.
      return null;
    }
  }
}