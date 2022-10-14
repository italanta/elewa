import { __DateFromStorage } from '@iote/time';

import { AddMessageFactory } from '@app/functions/conversations/messages/add-message';

import { MessagesDataService } from './data-services/messages.service';
import { ChatStatusDataService } from './data-services/chat-status.service';
import { ChannelDataService } from './data-services/channel-info.service';

import { Platforms } from '@app/model/convs-mgr/conversations/admin/system';
import { BaseMessage, RawMessageData } from '@app/model/convs-mgr/conversations/messages';
import { WhatsappChannel } from '@app/model/bot/channel';
import { ProcessMessageService } from './process-message/process-message.service';
import { HandlerTools } from '@iote/cqrs';
import { Block } from '@app/model/convs-mgr/conversations/chats';
import { CursorDataService } from './data-services/cursor.service';
import { BlockDataService } from './data-services/blocks.service';
import { ConnectionsDataService } from './data-services/connections.service';
import { SendMessageFactory } from '@app/functions/messages/whatsapp';

/**
 * Handles the main processes of the ChatBot
 */
export class ChatBotMainService {
  platform: Platforms;
  messageChannel: WhatsappChannel;
  chatId: string;

  constructor(
    private _msgDataService$: MessagesDataService,
    private _chatStatusService$: ChatStatusDataService,
    private _channelService$: ChannelDataService,
    private _blocksService$: BlockDataService,
    private _connService$: ConnectionsDataService,
    private _cursorDataService$: CursorDataService,
    private _tools: HandlerTools,
    platform: Platforms
  ) {
    this.platform = platform;
  }

  /** Outlines the journey of a message once we receive it */
  async run(req: RawMessageData) {
    // Initialize chat and convert message to base message
    const baseMessage = await this.init(req);

    // Process message and return next block
    const nextBlock = await this.processMessage(baseMessage);

    // Send the message back to the user
    await this.sendMessage({ msg: baseMessage, block: nextBlock });
  }

  /** Checks if the message is from a new user and then initializes chat */
  async init(req: RawMessageData) {
    // Check if the enduser is registered to a channel
    this.messageChannel = await this.getChannelInfo(req, this._channelService$);

    let baseMessage: BaseMessage;

    if (this.messageChannel) {
      // Add message to collection
      baseMessage = await this.addMessage(req);
      return baseMessage;
    } else {
      // Initialize chat status
      await this._chatStatusService$.initChatStatus(this.messageChannel, this.platform);

      // Add message to collection
      baseMessage = await this.addMessage(req);

      return baseMessage;
    }
  }

  async addMessage(req: RawMessageData) {
    // Use factory to resolve the platform
    const AddMessageService = new AddMessageFactory(this._msgDataService$).resolveAddMessagePlatform(req.platform);

    const baseMessage = await AddMessageService.addMessage(req, this.messageChannel);

    return baseMessage;
  }

  async processMessage(msg: BaseMessage) {
    // Pass dependencies to the Process Message Service
    const processMessage = new ProcessMessageService(this._cursorDataService$, this._connService$, this._blocksService$);

    this._tools.Logger.log(() => `[ProcessMessageHandler]._processMessage: Processing message ${JSON.stringify(msg)}.`);

    const userActivity = await this._cursorDataService$.getLatestCursor();

    if (!userActivity) {
      return await processMessage.getFirstBlock(this._tools);
    } else {
      return await processMessage.resolveNextBlock(msg, this._tools);
    }
  }

  async sendMessage(data: { msg: BaseMessage; block: Block }) {
    // Call factory to resolve the platform
    const client = new SendMessageFactory(data.msg.platform, this._tools).resolvePlatform()

    // Send the message
    await client.sendMessage(data.msg, data.block.type)
  }

  async getChannelInfo(msg: RawMessageData, channelDataService: ChannelDataService) {
    switch (msg.platform) {
      case Platforms.WhatsApp:
        return await channelDataService.getChannelInfo<WhatsappChannel>(msg.botUserPhoneNumber);

      default:
        return await channelDataService.getChannelInfo<WhatsappChannel>(msg.botUserPhoneNumber);
    }
  }
}
