import { CommunicationChannel, Cursor } from "@app/model/convs-mgr/conversations/admin/system";
import { StoryBlock, StoryBlockTypes } from "@app/model/convs-mgr/stories/blocks/main";
import { Button, QuestionMessageBlock } from "@app/model/convs-mgr/stories/blocks/messaging";
import { ButtonsBlockButton } from "@app/model/convs-mgr/stories/blocks/scenario";
import { Message, QuestionMessage } from "@app/model/convs-mgr/conversations/messages";

import { BlockDataService } from "../../data-services/blocks.service";

export class FallBackBlockService 
{

  getBlock(failedBlockId: string)
  {
    /**
     * The fall back block will reuse the structure of the question block. But
     *   they block type is different so that we can handle it differently on 
     *    the operation block level.
     */
    const block: QuestionMessageBlock = {
      id: `${failedBlockId}-fallback-${Date.now()}`,
      type: StoryBlockTypes.FallbackBlock,
      position: null,
      deleted: false,
      blockTitle: '',
      blockIcon: '',
      message: `Sorry, I could not understand your message. Please select what you want to do:`,
      options: this.__getFallBackOptions()
    };
    return block;
  }

  private __getFallBackOptions()
  {
    const fallBackOptions: ButtonsBlockButton<Button>[] = [
      {
        id: "1",
        message: "Resend Last Message",
      },
      {
        id: "2",
        message: "Restart Story",
      },
      {
        id: "3",
        message: "Restart Conversation",
      },
    ];

    return fallBackOptions;
  }

  async fallBack(channel: CommunicationChannel, currentCursor: Cursor, blockDataService: BlockDataService, message: Message)
	{
    const newCursor = currentCursor;
    let nextBlock: StoryBlock;

    const response =  message as QuestionMessage;
    const firstStory = channel.defaultStory;
    const orgId = channel.orgId;
    const currentStory = currentCursor.position.storyId;
    const lastBlockId = currentCursor.position.blockId.split('-')[0];
    
    if(!response.options) {
      newCursor.position.blockId = lastBlockId;
      nextBlock = await blockDataService.getBlockById(lastBlockId, orgId, currentStory);
      return { nextBlock, newCursor };
    }

    switch (response.options[0].optionId) {
      case '1':
        // Resend the last block
        newCursor.position.blockId = lastBlockId;
        nextBlock = await blockDataService.getBlockById(lastBlockId, orgId, currentStory);
        break;
      case '2':
        // Restart the current lesson
        nextBlock = await blockDataService.getFirstBlock(orgId, currentStory);

        newCursor.position.blockId = nextBlock.id;
        break;  
      case '3':
        // Restart the conversation from the beginning
        nextBlock = await blockDataService.getFirstBlock(orgId, firstStory);
        newCursor.position.blockId = nextBlock.id;
        newCursor.position.storyId = firstStory;
        break;
      default:
        // Resend the last block
        nextBlock = await blockDataService.getBlockById(lastBlockId, orgId, currentStory);
        newCursor.position.blockId = lastBlockId;
        break;
    }

		return {
			nextBlock,
			newCursor
		};
	}
}