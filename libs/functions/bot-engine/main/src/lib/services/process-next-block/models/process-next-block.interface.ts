import { Cursor } from "@app/model/convs-mgr/conversations/admin/system";
import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";

export interface IProcessNextBlock {
  handleBlock(storyBlock: StoryBlock, updatedCursor: Cursor, orgId: string, endUserId: string)
}