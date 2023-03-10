import { HandlerTools } from "@iote/cqrs";

import { Cursor } from "@app/model/convs-mgr/conversations/admin/system";
import { EndUser } from "@app/model/convs-mgr/conversations/chats";
import { StoryBlockTypes } from "@app/model/convs-mgr/stories/blocks/main";
import { JumpBlock } from "@app/model/convs-mgr/stories/blocks/messaging";

import { ActiveChannel } from "../model/active-channel.service";
import { BotEnginePlay } from "./bot-engine-play.service";
import { BlockDataService } from "./data-services/blocks.service";
import { ConnectionsDataService } from "./data-services/connections.service";
import { CursorDataService } from "./data-services/cursor.service";
import { MessagesDataService } from "./data-services/messages.service";
import { BotMediaProcessService } from "./media/process-media-service";
import { ProcessMessageService } from "./process-message/process-message.service";
import { JumpStoryBlockService } from "./process-next-block/block-type/jump-story-block.service";

export class BotEngineJump extends BotEnginePlay
{
  cursorDataService$: CursorDataService;

  constructor(
    _processMessageService$: ProcessMessageService,
    _cursorDataService$: CursorDataService,
    protected _msgService$: MessagesDataService,
    _processMediaService$: BotMediaProcessService,
    protected _activeChannel: ActiveChannel,
    protected _tools: HandlerTools)
  {
    super(_processMessageService$, _cursorDataService$, _msgService$, _processMediaService$, _activeChannel, _tools);

    this.orgId = _activeChannel.channel.orgId;
    this.cursorDataService$ = _cursorDataService$;
  }

  async jump(storyId: string, orgId: string, endUser: EndUser, currentCursor: Cursor, blockId?: string) 
  {
    const {storyBlock, newCursor} = await this.__moveChat(storyId, orgId, currentCursor, endUser.id, blockId);

    await this.__reply(storyBlock, endUser);
    
    await this.cursorDataService$.updateCursor(endUser.id, this.orgId, newCursor);

    await this.play(null, endUser, newCursor);
  }

  private async __moveChat(storyId: string, orgId: string, currentCursor: Cursor, endUserId: string, blockId?: string) 
  {

    const connDataService = new ConnectionsDataService(this._activeChannel.channel, this._tools);
    const blockDataService = new BlockDataService(this._activeChannel.channel, connDataService, this._tools);

    const jumpBlockService$ = new JumpStoryBlockService(blockDataService, connDataService, this._tools);

    const jumpBlock: JumpBlock = {

      type: StoryBlockTypes.JumpBlock,
      position: undefined,
      deleted: false,
      blockTitle: '',
      blockIcon: '',
      targetStoryId: storyId,
      targetBlockId: blockId || "",
    }

   const {storyBlock, newCursor}  =  await jumpBlockService$.handleBlock(jumpBlock, currentCursor, orgId, endUserId);

   return {storyBlock, newCursor};

  }
}