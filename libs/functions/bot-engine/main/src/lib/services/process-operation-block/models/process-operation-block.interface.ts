import { Cursor } from "@app/model/convs-mgr/conversations/admin/system";
import { Message } from "@app/model/convs-mgr/conversations/messages";
import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";

export interface IProcessOperationBlock {
  sideOperations: Promise<any>[];
  handleBlock(storyBlock: StoryBlock, updatedCursor: Cursor, orgId: string, endUserId: string, message?: Message)
}