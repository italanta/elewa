import { HandlerTools } from '@iote/cqrs';

import { AddMessageFactory } from '@app/functions/conversations/messages/add-message';

import { MessagesDataService } from './data-services/messages.service';
import { ChatStatusDataService } from './data-services/chat-status.service';
import { ChannelDataService } from './data-services/channel-info.service';
import { CursorDataService } from './data-services/cursor.service';
import { BlockDataService } from './data-services/blocks.service';
import { ConnectionsDataService } from './data-services/connections.service';
import { ChatBotProcessMessageService } from './chatbot-process-message.service';

import { Platforms } from '@app/model/convs-mgr/conversations/admin/system';
import { BaseMessage, Chat, ChatStatus, RawMessageData } from '@app/model/convs-mgr/conversations/messages';
import { BaseChannel, WhatsappChannel } from '@app/model/bot/channel';

/**
 * Handles the main processes of the ChatBot
 */
export class ChatBotMainService {
  platform: Platforms;
  messageChannel: BaseChannel;
  chatId: string;
  chatInfo: Chat;

  constructor(
    private _msgDataService$: MessagesDataService,
    private _chatStatusService$: ChatStatusDataService,
    private _channelService$: ChannelDataService,
    private _tools: HandlerTools,
    platform: Platforms
  ) {
    this.platform = platform;
  }

  async main(rawMessage: RawMessageData){

    const baseMessage = await this._init(rawMessage)

    // To later use a DI container to manage instances and dynamically inject approtiate dependencies
    const connDataService  = new ConnectionsDataService(baseMessage, this._tools)
    const cursorDataService = new CursorDataService(baseMessage, this._tools)
    const blockDataService = new BlockDataService(baseMessage, connDataService, this._tools)

    this._tools.Logger.log(() => `[ChatManager].main - Current chat status: ${this.chatInfo.status}`);

    const chat = new ChatBotProcessMessageService(blockDataService, connDataService, cursorDataService, this._tools, this.platform)

    switch (this.chatInfo.status) {
      case ChatStatus.Running:
        await chat.run(baseMessage)
        break;
      case ChatStatus.Paused:
        await chat.sendTextMessage(baseMessage, "Chat has been paused.")
        break;      
      default:
        break;
    }
  }

    /** Checks if the message is from a new user and then initializes chat */
    private async _init(req: RawMessageData) {
      // Check if the enduser is registered to a channel
      this.messageChannel = await this._getChannelInfo(req, this._channelService$);

      this.chatInfo =  await this._chatStatusService$.getChatStatus(this.messageChannel.storyId, req.botUserPhoneNumber, this.platform)
  
      let baseMessage: BaseMessage;
  
      if (!this.chatInfo) {
        // Initialize chat status
        this.chatInfo = await this._chatStatusService$.initChatStatus(this.messageChannel, req.botUserPhoneNumber, this.platform);

        // Add message to collection
        baseMessage = await this._addMessage(req);

        this._tools.Logger.log(() => `[ChatManager].init - Chat initialized}`);

        return baseMessage;
      } else {
  
        // Add message to collection
        baseMessage = await this._addMessage(req);

        this._tools.Logger.log(() => `[ChatManager].init - Message added}`);

        return baseMessage;
      }
    }

    private async _getChannelInfo(msg: RawMessageData, channelDataService: ChannelDataService) {
      switch (msg.platform) {
        case Platforms.WhatsApp:
          return await channelDataService.getChannelInfo(msg.botAccountphoneNumberId);
        default:
          return await channelDataService.getChannelInfo(msg.botAccountphoneNumberId);
      }
    }

  /**
   * Inteprates the raw message received from the hook and saves it to firestore
   * @param req - Raw Message data received from the webhook
   */
  private async _addMessage(req: RawMessageData) {
    // Use factory to resolve the platform
    const AddMessageService = new AddMessageFactory(this._msgDataService$).resolveAddMessagePlatform(req.platform);

    const baseMessage = await AddMessageService.addMessage(req, this.messageChannel as WhatsappChannel);

    return baseMessage;
  }
}
