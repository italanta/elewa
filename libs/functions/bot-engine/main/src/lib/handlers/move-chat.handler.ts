import { HandlerTools } from '@iote/cqrs';

import { FunctionHandler, RestResult200, FunctionContext } from '@ngfi/functions';
import { JumpStoryBlockService } from '../services/process-next-block/block-type/jump-story-block.service';

import { CommunicationChannel, Cursor, __PlatformTypeToPrefix, __PrefixToPlatformType } from "@app/model/convs-mgr/conversations/admin/system";

import { JumpBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';

import { BlockDataService } from '../services/data-services/blocks.service';
import { ConnectionsDataService } from '../services/data-services/connections.service';
import { CursorDataService } from '../services/data-services/cursor.service';

import { ActiveChannelFactory } from '../factories/active-channel/active-channel.factory';
import { ChannelDataService } from '../services/data-services/channel-info.service';
import { BlockToStandardMessage } from '../io/block-to-message-parser.class';
import { MessagesDataService } from '../services/data-services/messages.service';

export class MoveChatHandler extends FunctionHandler<{ storyId: string, orgId: string, endUserId: string, blockId?: string}, RestResult200>
{
  jumpBlockService$: JumpStoryBlockService;
  /**
   * Put a break on execution and halt the system to talk to a Human agent. */
  public async execute(req: { storyId: string, orgId: string, endUserId: string, blockId?: string}, context: FunctionContext, tools: HandlerTools)
  {
    tools.Logger.log(() => `[MoveChatHandler].execute: Open up channel to talk to Human Agent.`);
    tools.Logger.log(() => JSON.stringify(req));

    const splitEndUserId = req.endUserId.split('_');
    const n = parseInt(splitEndUserId[1]);

    const phoneNumber = splitEndUserId[2];

    const _channelService$ = new ChannelDataService(tools);

    const communicationChannel: CommunicationChannel = await _channelService$.getChannelByConnection(n) as CommunicationChannel;

    const connDataService = new ConnectionsDataService(communicationChannel, tools);
    const blockDataService = new BlockDataService(communicationChannel, connDataService, tools);
    const cursorDataService = new CursorDataService(tools);
    const msgDataService = new MessagesDataService(tools);

    const currentCursor = await cursorDataService.getLatestCursor(req.endUserId, req.orgId);

    this.jumpBlockService$ = new JumpStoryBlockService(blockDataService, connDataService, tools);

    const activeChannelFactory = new ActiveChannelFactory();

    const activeChannel = activeChannelFactory.getActiveChannel(communicationChannel, tools);

    const {storyBlock, newCursor} = await this._moveChat(req.storyId, req.orgId, currentCursor as Cursor, req.endUserId, req.blockId);

    const outgoingMessage = activeChannel.parseOutMessage(storyBlock, phoneNumber);

    await activeChannel.send(outgoingMessage as any);

    const blockToMessage = new BlockToStandardMessage().convert(storyBlock);

    await msgDataService.saveMessage(blockToMessage, req.endUserId, req.orgId);

    await cursorDataService.updateCursor(req.endUserId, req.orgId, newCursor);

    return { success: true } as RestResult200;
  }

  // Pause the chat
  private async _moveChat(storyId: string, orgId: string, currentCursor: Cursor, endUserId: string, blockId?: string) {

    const jumpBlock: JumpBlock = {

      type: StoryBlockTypes.JumpBlock,
      position: undefined,
      deleted: false,
      blockTitle: '',
      blockIcon: '',
      targetStoryId: storyId,
      targetBlockId: blockId || "",
    }

   const {storyBlock, newCursor}  =  await this.jumpBlockService$.handleBlock(jumpBlock, currentCursor, orgId, endUserId);

   return {storyBlock, newCursor};

  }
}
