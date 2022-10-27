import { HandlerTools } from '@iote/cqrs';
import { Logger } from '@iote/bricks-angular';
import { FunctionContext, RestResult200 } from '@ngfi/functions';

import { IncomingMessage } from '@app/model/convs-mgr/conversations/messages';

import { BotEngineChatManager } from './services/bot-engine-chat-manager.service';
import { MessagesDataService } from './services/data-services/messages.service';
import { ChatStatusDataService } from './services/data-services/chat-status.service';

import { ActiveChannel } from './model/active-channel.service';

import { ChannelDataService } from './services/data-services/channel-info.service';
import { ConnectionsDataService } from './services/data-services/connections.service';
import { CursorDataService } from './services/data-services/cursor.service';
import { BlockDataService } from './services/data-services/blocks.service';

import { ReceiveMessageInterpreter } from './interpreter.interface';

/**
 * This model is responsible for the flow of chat messages between our bot and 
 *    an end user (which is an identifiable user that is sending messages over a specific channel)
 * 
 * The model receives the message, processes it and formulates a response (if applicable).
 */
export class EngineBotManager
{
  constructor(private _context: FunctionContext, 
              private _tools: HandlerTools,
              private _logger: Logger,
              private _channel: ActiveChannel,
              private _interpreter: ReceiveMessageInterpreter)
  { }

  /**
   * Receives a message, through a channel, from a third-party registered platform, 
   *    handles it, and potentially responds to it.
   * 
   * STEP 1: 
   * STEP 2: 
   * STEP 3: 
   * STEP 4: 
   * 
   * @param {IncomingMessage} message - An sanitized incoming message from a third-party provider.
   * @returns A REST 200/500 response so the third-party provider knows the message arrived well/failed.
   */
  public async run(message: IncomingMessage)
  {
    this._logger.log(() => `Processing incoming message from channel ${message.channel.id} - ${message.channel.type}.`);
    
    try 
    {
      // STEP 1: Initialize the services which are necessary for execution of the 
      // TODO: use a DI container to manage instances and dynamically inject approtiate dependencies
      const endUser = __


    // To later use a DI container to manage instances and dynamically inject approtiate dependencies
    const connDataService = new ConnectionsDataService(this.messageChannel, this._tools);
    const cursorDataService = new CursorDataService(baseMessage, this.messageChannel, this._tools);
    const blockDataService = new BlockDataService(this.messageChannel, connDataService, this._tools);

    this._tools.Logger.log(() => `[ChatManager].main - Current chat status: ${this.chatInfo.status}`);

     // Check if the enduser is registered to a channel
     this.messageChannel = await this._getChannelInfo(req, this._channelService$);

     // Resolve the platform and the message type to get the right message interpretation method
     const interpretToBaseMessage = new ReceiveInterpreterFactory().resolvePlatform(req.platform).resolveMessageType(req.messageType);
 
     // Convert the Raw Message Data to Base Message
     this.baseMessage = interpretToBaseMessage(req, this.messageChannel);
 
     this._tools.Logger.log(() => `[ChatManager]._init - Interpreted message: ${JSON.stringify(this.baseMessage)}}`);
 
     // Get the current chat information
     this.chatInfo = await this._chatStatusService$.getChatStatus(this.messageChannel.storyId, this.baseMessage);
 
     if (!this.chatInfo) {
       // Initialize chat status
       this.chatInfo = await this._chatStatusService$.initChatStatus(this.messageChannel.storyId, this.baseMessage);
 
       // Add message to collection
       this.promises.push(this._addMessage(this.baseMessage));
 
       this._tools.Logger.log(() => `[ChatManager].init - Chat initialized}`);
 
       return this.baseMessage;
     } else {
       // Add message to collection
       this.promises.push(this._addMessage(this.baseMessage));
 
       this._tools.Logger.log(() => `[ChatManager].init - Message added`);
 
       return this.baseMessage;
     }

    /** Manage the ongoing chat using the chat status */
    switch (this.chatInfo.status) {
      case ChatStatus.Running:
        // Process the message and send the next block back to the user
        const nextBlock = await bot.processMessage(baseMessage);

        // Update the cursor
        this.promises.push(bot.updateCursor(nextBlock))

        // Send the message back to the user
        await bot.sendMessage({ msg: baseMessage, block: nextBlock }, this.messageChannel);

        // Finally Resolve pending promises that do not affect the processing of the message
        await Promise.all(this.promises);

        break;
      case ChatStatus.Paused:
        await bot.sendTextMessage(baseMessage, 'Chat has been paused.', this.messageChannel);
        break;
      default:
        break;
    }

      await chatManager.execute(req)

      return { success: true} as RestResult200

    } catch (error) {

      tools.Logger.error(() => `[EngineChatManagerHandler].execute: Chat Manager encountered an error: ${error}`);
      
    }
  }

  /**
   * The user/story owner registers a story to a channel from the dashboard
   * Gets the channel information that the story was registered to using the businessAccountId
   * */
   private async _getChannelInfo(msg: IncomingMessage, channelDataService: ChannelDataService) {
    switch (msg.platform) {
      case PlatformType.WhatsApp:
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
