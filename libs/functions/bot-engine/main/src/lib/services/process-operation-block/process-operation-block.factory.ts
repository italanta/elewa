import { HandlerTools } from "@iote/cqrs";

import { StoryBlockTypes } from "@app/model/convs-mgr/stories/blocks/main";

import { BlockDataService } from "../data-services/blocks.service";
import { ConnectionsDataService } from "../data-services/connections.service";
import { WebhookBlockService } from "./block-type/webhook-block.service";

import { JumpStoryBlockService } from "./block-type/jump-story-block.service";
import { IProcessOperationBlock } from "./models/process-operation-block.interface";
import { EndStoryBlockService } from "./block-type/end-story-block.service";
import { FailBlockService } from "./block-type/fail-story-block.service";
import { ConditionalBlockService } from "./block-type/conditional-block.service";
import { EventBlockService } from "./block-type/event-block.service";
import { AssessmentBlockService } from "./block-type/assessment-block.service";


export class OperationBlockFactory
{
  constructor(private _blockDataService: BlockDataService, private _connDataService: ConnectionsDataService, private tools: HandlerTools) {}

  resolve(storyBlockType: StoryBlockTypes): IProcessOperationBlock
  {
    switch (storyBlockType) {
      case StoryBlockTypes.JumpBlock:
        return new JumpStoryBlockService(this._blockDataService, this._connDataService, this.tools);
      case StoryBlockTypes.WebhookBlock:
        return new WebhookBlockService(this._blockDataService, this._connDataService, this.tools);
      case StoryBlockTypes.EndStoryAnchorBlock:
        return new EndStoryBlockService(this._blockDataService, this._connDataService, this.tools);
      case StoryBlockTypes.FailBlock:
        return new FailBlockService(this._blockDataService, this._connDataService, this.tools);
      case StoryBlockTypes.Conditional:
        return new ConditionalBlockService(this._blockDataService, this._connDataService, this.tools);
      case StoryBlockTypes.Assessment:
        return new AssessmentBlockService(this._blockDataService, this._connDataService, this.tools);
      case StoryBlockTypes.Event:
        return new EventBlockService(this._blockDataService, this._connDataService, this.tools);
      default:
        break;
    }
  }
}
