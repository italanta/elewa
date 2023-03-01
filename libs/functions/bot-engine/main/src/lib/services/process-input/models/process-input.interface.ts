import { Message } from "@app/model/convs-mgr/conversations/messages";
import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";

export interface IProcessInput
{
  handleInput(message: Message, lastBlock: StoryBlock, orgId: string, endUserId: string): Promise<boolean>;
}