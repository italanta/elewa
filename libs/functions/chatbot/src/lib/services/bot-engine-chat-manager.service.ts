import { HandlerTools } from '@iote/cqrs';

import { AddMessageFactory } from '@app/functions/conversations/messages/add-message';

import { MessagesDataService } from './data-services/messages.service';
import { ChatStatusDataService } from './data-services/chat-status.service';
import { ChannelDataService } from './data-services/channel-info.service';
import { CursorDataService } from './data-services/cursor.service';
import { BlockDataService } from './data-services/blocks.service';
import { ConnectionsDataService } from './data-services/connections.service';
import { BotEngineMainService } from './bot-engine-main.service';

import { Platforms } from '@app/model/convs-mgr/conversations/admin/system';
import { BaseMessage, Chat, ChatStatus, RawMessageData } from '@app/model/convs-mgr/conversations/messages';
import { BaseChannel, WhatsappChannel } from '@app/model/bot/channel';
import { ReceiveInterpreterFactory } from './interpreter/receive-interpreter.factory';

/**
 * Manages the main operations of the bot
 */
export class BotEngineChatManager {
  /** The messaging platform the user is texting from  */
  platform: Platforms;

  /** The registered channel information that links the api to the story */
  messageChannel: BaseChannel;

  /** Information about the chat e.g. chat-status */
  chatInfo: Chat;

  baseMessage: BaseMessage;

  /** Holds all promises that don't need to be resolved immediately */
  promises: Promise<any>[] = [];

  constructor(
    private _msgDataService$: MessagesDataService,
    private _chatStatusService$: ChatStatusDataService,
    private _channelService$: ChannelDataService,
    private _tools: HandlerTools,
    platform: Platforms
  ) {
    this.platform = platform;
  }

  async main(rawMessage: RawMessageData) {
    // Initializes chat
    const baseMessage = await this._init(rawMessage);

    // To later use a DI container to manage instances and dynamically inject approtiate dependencies
    const connDataService = new ConnectionsDataService(baseMessage, this._tools);
    const cursorDataService = new CursorDataService(baseMessage, this._tools);
    const blockDataService = new BlockDataService(baseMessage, connDataService, this._tools);

    this._tools.Logger.log(() => `[ChatManager].main - Current chat status: ${this.chatInfo.status}`);

    // Instantiate the Bot Engine Main Service
    const bot = new BotEngineMainService(blockDataService, connDataService, cursorDataService, this._tools, this.platform);

    /** Manage the ongoing chat using the chat status */
    switch (this.chatInfo.status) {
      case ChatStatus.Running:
        // Process the message and send the next block back to the user
        const nextBlock = await bot.processMessage(baseMessage);

        // Update the cursor
        this.promises.push(bot.updateCursor(nextBlock))

        // Send the message back to the user
        await bot.sendMessage({ msg: baseMessage, block: nextBlock }, baseMessage.phoneNumber);

        // Finally Resolve pending promises that do not affect the processing of the message
        await Promise.all(this.promises);

        break;
      case ChatStatus.Paused:
        await bot.sendTextMessage(baseMessage, 'Chat has been paused.');
        break;
      default:
        break;
    }
  }

  /** 
   * Checks if the message is from a new user and then initializes chat
   * Gets the current chat information 
   * Calls the interpreter
   * Saves the interpreted message to firestore
   * */
  private async _init(req: RawMessageData) {
    // Check if the enduser is registered to a channel
    this.messageChannel = await this._getChannelInfo(req, this._channelService$);

    // Get the current chat information
    this.chatInfo = await this._chatStatusService$.getChatStatus(this.messageChannel.storyId, req.botUserPhoneNumber, this.platform);

    // Resolve the platform and the message type to get the right message interpretation method
    const interpretToBaseMessage = new ReceiveInterpreterFactory().resolvePlatform(req.platform).resolveMessageType(req.messageType);

    // Convert the Raw Message Data to Base Message
    this.baseMessage = interpretToBaseMessage(req, this.messageChannel);

    if (!this.chatInfo) {
      // Initialize chat status
      this.chatInfo = await this._chatStatusService$.initChatStatus(this.messageChannel, req.botUserPhoneNumber, this.platform);

      // Add message to collection
      this.promises.push(this._addMessage(this.baseMessage));

      this._tools.Logger.log(() => `[ChatManager].init - Chat initialized}`);

      return this.baseMessage;
    } else {
      // Add message to collection
      this.promises.push(this._addMessage(this.baseMessage));

      this._tools.Logger.log(() => `[ChatManager].init - Message added}`);

      return this.baseMessage;
    }
  }

  /**
   * The user/story owner registers a story to a channel from the dashboard
   * Gets the channel information that the story was registered to using the businessAccountId
   * */
  private async _getChannelInfo(msg: RawMessageData, channelDataService: ChannelDataService) {
    switch (msg.platform) {
      case Platforms.WhatsApp:
        return await channelDataService.getChannelInfo(msg.botAccountphoneNumberId);
      default:
        return await channelDataService.getChannelInfo(msg.botAccountphoneNumberId);
    }
  }

  /**
   * Adds the interpreted message to firestore, messages collection
   * @param msg - Already intepreted Base Message
   */
  private async _addMessage(msg: BaseMessage) {
    // Use factory to resolve the platform
    const AddMessageService = new AddMessageFactory(this._msgDataService$).resolveAddMessagePlatform(msg.platform);

    const baseMessage = await AddMessageService.addMessage(msg, this.messageChannel as WhatsappChannel);

    return baseMessage;
  }
}
