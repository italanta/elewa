import { HandlerTools } from "@iote/cqrs";

import { Cursor } from "@app/model/convs-mgr/conversations/admin/system";
import { StoryBlockTypes } from "@app/model/convs-mgr/stories/blocks/main";

import { BlockDataService } from "../data-services/blocks.service";
import { ConnectionsDataService } from "../data-services/connections.service";
import { WebhookBlockService } from "../next-block/block-type/webhook-block.service";
import { JumpStoryBlockService } from "./block-type/jump-story-block.service";
import { IProcessNextBlock } from "./models/process-next-block.interface";

export class ProcessNextBlockFactory
{
  constructor(private _blockDataService: BlockDataService, private _connDataService: ConnectionsDataService, private tools: HandlerTools){}

  resolve(storyBlockType: StoryBlockTypes): IProcessNextBlock
  {
    switch (storyBlockType) {
      case StoryBlockTypes.JumpBlock:
        return new JumpStoryBlockService(this._blockDataService, this._connDataService, this.tools);
      case StoryBlockTypes.WebhookBlock:
        return new WebhookBlockService(this._blockDataService, this._connDataService, this.tools);
      default:
        break;
    }
  }
}