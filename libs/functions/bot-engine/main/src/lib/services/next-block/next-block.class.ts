import { HandlerTools } from "@iote/cqrs";
import { Query } from "@ngfi/firestore-qbuilder";

import { Message } from "@app/model/convs-mgr/conversations/messages";
import { StoryBlock, StoryBlockTypes } from "@app/model/convs-mgr/stories/blocks/main";
import { ErrorMessageBlock } from "@app/model/convs-mgr/stories/blocks/messaging";
import { Cursor } from "@app/model/convs-mgr/conversations/admin/system";


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
  }
