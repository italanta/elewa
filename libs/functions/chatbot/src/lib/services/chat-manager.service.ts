import { HandlerTools } from '@iote/cqrs';

import { AddMessageFactory } from '@app/functions/conversations/messages/add-message';

import { MessagesDataService } from './data-services/messages.service';
import { ChatStatusDataService } from './data-services/chat-status.service';
import { ChannelDataService } from './data-services/channel-info.service';
import { CursorDataService } from './data-services/cursor.service';
import { BlockDataService } from './data-services/blocks.service';
import { ConnectionsDataService } from './data-services/connections.service';
import { ChatBotMainService } from './main-chatbot.service';

import { Platforms } from '@app/model/convs-mgr/conversations/admin/system';
import { BaseMessage, ChatStatus, RawMessageData } from '@app/model/convs-mgr/conversations/messages';
import { WhatsappChannel } from '@app/model/bot/channel';

/**
 * Handles the main processes of the ChatBot
 */
export class ChatManagerService {
  platform: Platforms;
  messageChannel: WhatsappChannel;
  chatId: string;

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


    const currentChatInfo  = await this._chatStatusService$.getChatStatus(baseMessage.storyId)

    const chat = new ChatBotMainService(blockDataService, connDataService, cursorDataService, this._tools, this.platform)

    switch (currentChatInfo.status) {
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
  
      let baseMessage: BaseMessage;
  
      if (this.messageChannel) {
        // Add message to collection
        baseMessage = await this._addMessage(req);
        return baseMessage;
      } else {
        // Initialize chat status
        await this._chatStatusService$.initChatStatus(this.messageChannel, this.platform);
  
        // Add message to collection
        baseMessage = await this._addMessage(req);
  
        return baseMessage;
      }
    }

    private async _getChannelInfo(msg: RawMessageData, channelDataService: ChannelDataService) {
      switch (msg.platform) {
        case Platforms.WhatsApp:
          return await channelDataService.getChannelInfo<WhatsappChannel>(msg.botUserPhoneNumber);
  
        default:
          return await channelDataService.getChannelInfo<WhatsappChannel>(msg.botUserPhoneNumber);
      }
    }

  /**
   * Inteprates the raw message received from the hook and saves it to firestore
   * @param req - Raw Message data received from the webhook
   */
  private async _addMessage(req: RawMessageData) {
    // Use factory to resolve the platform
    const AddMessageService = new AddMessageFactory(this._msgDataService$).resolveAddMessagePlatform(req.platform);

    const baseMessage = await AddMessageService.addMessage(req, this.messageChannel);

    return baseMessage;
  }
}
