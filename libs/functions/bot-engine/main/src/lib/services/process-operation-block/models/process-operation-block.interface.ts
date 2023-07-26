import { Cursor } from "@app/model/convs-mgr/conversations/admin/system";
import { EndUser } from "@app/model/convs-mgr/conversations/chats";
import { Message } from "@app/model/convs-mgr/conversations/messages";
import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";

export interface IProcessOperationBlock {
  sideOperations: Promise<any>[];
  handleBlock(storyBlock: StoryBlock, updatedCursor: Cursor, orgId: string, endUser: EndUser, message?: Message)
}