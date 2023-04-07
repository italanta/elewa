import { HandlerTools } from '@iote/cqrs';

import { FunctionHandler, RestResult200, FunctionContext, RestResult } from '@ngfi/functions';
import { JumpStoryBlockService } from '../services/process-operation-block/block-type/jump-story-block.service';

import { CommunicationChannel, Cursor, __PlatformTypeToPrefix, __PrefixToPlatformType } from "@app/model/convs-mgr/conversations/admin/system";

import { JumpBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { isOutputBlock, StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';

import { BlockDataService } from '../services/data-services/blocks.service';
import { ConnectionsDataService } from '../services/data-services/connections.service';
import { CursorDataService } from '../services/data-services/cursor.service';

import { ActiveChannelFactory } from '../factories/active-channel/active-channel.factory';
import { ChannelDataService } from '../services/data-services/channel-info.service';
import { MessagesDataService } from '../services/data-services/messages.service';
import { ProcessMessageService } from '../services/process-message/process-message.service';
import { BotMediaProcessService } from '../services/media/process-media-service';
import { BotEngineJump } from '../services/bot-engine-jump.service';
import { EndUserDataService } from '../services/data-services/end-user.service';
import { ChatStatus, EndUser } from '@app/model/convs-mgr/conversations/chats';

export class MoveChatHandler extends FunctionHandler<{ storyId: string, orgId: string, endUserId: string, blockId?: string}, RestResult>
{
  jumpBlockService$: JumpStoryBlockService;
  sideOperations: Promise<any>[] = [];
  orgId: string;
  /**
   * Put a break on execution and halt the system to talk to a Human agent. */
  public async execute(req: { storyId: string, endUserId: string, blockId?: string}, context: FunctionContext, tools: HandlerTools)
  {
    tools.Logger.log(() => `[MoveChatHandler].execute: Attempting to jump user to story: ${req.storyId}`);
    tools.Logger.log(() => JSON.stringify(req));

    const splitEndUserId = req.endUserId.split('_');
    const n = parseInt(splitEndUserId[1]);
    const phoneNumber = splitEndUserId[2];

    const _channelService$ = new ChannelDataService(tools);

    const communicationChannel: CommunicationChannel = await _channelService$.getChannelByConnection(n) as CommunicationChannel;

    tools.Logger.log(()=>(`[MoveChatHandler].execute: Communication Channel: ${JSON.stringify(communicationChannel)}`));

    this.orgId = communicationChannel.orgId;

    const connDataService = new ConnectionsDataService(communicationChannel, tools);
    const blockDataService = new BlockDataService(communicationChannel, connDataService, tools);
    const cursorDataService = new CursorDataService(tools);
    const msgDataService = new MessagesDataService(tools);
    const processMediaService = new BotMediaProcessService(tools);


    const endUser: EndUser = {
      id: req.endUserId,
      phoneNumber,
      status: ChatStatus.Running
    }

    try {
      const currentCursor = await cursorDataService.getLatestCursor(req.endUserId, this.orgId);

      tools.Logger.log(() => `[MoveChatHandler].execute: Current Cursor: ${JSON.stringify(currentCursor)}`);

      const activeChannelFactory = new ActiveChannelFactory();
  
      const activeChannel = activeChannelFactory.getActiveChannel(communicationChannel, tools);
      
      const processMessageService = new ProcessMessageService(cursorDataService, connDataService, blockDataService, tools, activeChannel, processMediaService);
  
      const bot = new BotEngineJump(processMessageService, cursorDataService, msgDataService, processMediaService, activeChannel, tools);
  
      await bot.jump(req.storyId, this.orgId, endUser, currentCursor as Cursor, req.blockId);
  
      return { success: true } as RestResult200;
    } catch (error) {
      tools.Logger.log(() => `[MoveChatHandler].execute: Error: ${error}`);

      return { status: 500 } as RestResult;
    }
  }
}
