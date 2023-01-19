import { HandlerTools, Logger } from "@iote/cqrs";

import { FailBlock } from "@app/model/convs-mgr/stories/blocks/messaging";
import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";
import { Cursor } from "@app/model/convs-mgr/conversations/admin/system";
import { Message } from "@app/model/convs-mgr/conversations/messages";

import { BlockDataService } from "../../data-services/blocks.service";
import { ConnectionsDataService } from "../../data-services/connections.service";

import { NextBlockService } from "../next-block.class";

import { CursorDataService } from "../../data-services/cursor.service";

/**
 * When an end user hit a fail block we can either end the conversation(return null) or 
 *  in case of a child story, return the fail block linked to the jump block (fail state).
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
   * When a user hits the fail block in a child story, we: 
   *  1. Pop the RoutedCursor at the top of the stack
   *  2. Use the RoutedCursor to construct a new cursor from @see RoutedCursor.blockFail
   *  3. Update the cursor
   *  4. Resolve and return the fail block
   */
  async getNextBlock(msg: Message, currentCursor: Cursor, currentBlock: FailBlock, orgId: string, currentStory: string, endUserId?: string): Promise<StoryBlock>
  {
    const cursorService = new CursorDataService(this.tools);

    const cursor = currentCursor;

    /** If the parent stack is not empty, then we are in a child story */
    if (!currentCursor.parentStack.isEmpty()) {
      // Pop the RoutedCursor at the top of the stack
      const topRoutineCursor = cursor.parentStack.pop();

      const topRoutineStoryId = topRoutineCursor.storyId;
      const topRoutineBlockFail = topRoutineCursor.blockFail;

      // Use the RoutedCursor to construct a new cursor
      const newCursor: Cursor = {
        position: { storyId: topRoutineStoryId, blockId: topRoutineBlockFail },
        parentStack: currentCursor.parentStack

      };
      // Update the cursor
      await cursorService.updateCursor(endUserId, orgId, newCursor);

      // Resolve and return the success block
      const nextBlock = await this._blockDataService.getBlockById(topRoutineBlockFail, orgId, currentStory);

      return nextBlock;
    } else {
      // We return null when we hit the end of the parent story.
      // TODO: To implement handling null in the bot engine once refactor on PR#210 is approved.
      return null;
    }
  }
}