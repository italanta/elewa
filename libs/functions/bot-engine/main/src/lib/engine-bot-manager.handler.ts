import { HandlerTools } from '@iote/cqrs';
import { Logger } from '@iote/bricks-angular';
import { RestResult200 } from '@ngfi/functions';

import { __PlatformTypeToPrefix } from '@app/model/convs-mgr/conversations/admin/system';
import { Chat, ChatStatus, Message } from '@app/model/convs-mgr/conversations/messages';

import { ConnectionsDataService } from './services/data-services/connections.service';
import { CursorDataService } from './services/data-services/cursor.service';
import { BlockDataService } from './services/data-services/blocks.service';
import { BotEngineMainService } from './services/bot-engine-main.service';
import { MessagesDataService } from './services/data-services/messages.service';
import { ChatStatusDataService } from './services/data-services/chat-status.service';

import { ActiveChannel } from './model/active-channel.service';

// import { ReceiveMessageInterpreter } from './interpreter.interface';

/**
 * This model is responsible for the flow of chat messages between our bot and
 *    an end user (which is an identifiable user that is sending messages over a specific channel)
 *
 * The model receives the message, processes it and formulates a response (if applicable).
 */
export class EngineBotManager 
{
  constructor(private _tools: HandlerTools, private _logger: Logger, private _activeChannel: ActiveChannel) {}

  /**
   * Receives a message, through a channel, from a third-party registered platform,
   *    handles it, and potentially responds to it.
   *
   * STEP 1: Initialize the services which are necessary for execution of the bot engine
   * STEP 2: Get the current chat information.
   * STEP 3: 
   * STEP 4:
   *
   * @param {IncomingMessage} message - An sanitized incoming message from a third-party provider.
   * @returns A REST 200/500 response so the third-party provider knows the message arrived well/failed.
   */
  public async run(message: Message) 
  {
    /**  */
    let chatInfo: Chat;

    /**
     * The chatbot has some asynchronous operations (which we dont have to wait for, in order to process the message) e.g. saving the messages to firebase
     * 
     * So, to ensure faster response to end users, we store all these operations to an array and resolve them after we have responded to the user
     * 
     */
    let promises: Promise<any>[] = [];

    this._logger.log(() => `Processing message ${JSON.stringify(message)}.`);

    try {
      // STEP 1: Initialize the services which are necessary for execution of the bot engine
      // TODO: use a DI container to manage instances and dynamically inject appropriate dependencies

      const connDataService = new ConnectionsDataService(this._activeChannel.channel, this._tools);
      const blockDataService = new BlockDataService(this._activeChannel.channel, connDataService, this._tools);
      const cursorDataService = new CursorDataService(this._tools);
      const _msgDataService$ = new MessagesDataService(this._tools);

      const _chatStatusService$ = new ChatStatusDataService(this._tools);

      //TODO: Find a better way because we are passing the active channel twice
      const bot = new BotEngineMainService(blockDataService, connDataService, cursorDataService, _msgDataService$, this._tools, this._activeChannel);

      const END_USER_ID = bot.generateEndUserId(message);
      
      // STEP 2: Get the current chat information
      chatInfo = await _chatStatusService$.getChatStatus(END_USER_ID);

      if (!chatInfo)
          // Initialize chat status
          chatInfo = await _chatStatusService$.initChatStatus(END_USER_ID);
          this._tools.Logger.log(() => `[ChatManager].init - Chat initialized}`);

     this._tools.Logger.log(() => `[ChatManager].main - Current chat status: ${chatInfo.status}`);

      // Add message to collection
      promises.push(bot.saveMessage(message, END_USER_ID));

      // Manage the ongoing chat using the chat status 
      switch (chatInfo.status) {
        case ChatStatus.Running:
          // Process the message and get the next block in the story that is to be sent back to the user
          const nextBlock = await bot.processMessage(message, END_USER_ID);

          // Send the block back to the user
          await bot.reply(nextBlock, message.endUserPhoneNumber);

          // Update the cursor, by pushing it to the promises array
          promises.push(bot.updateCursor(nextBlock, END_USER_ID));

          // Finally Resolve pending operations that do not affect the processing of the message
          await Promise.all(promises);

          break;
        case ChatStatus.Paused:
          await bot.sendTextMessage("Chat has been paused", message.endUserPhoneNumber)
          break;
        default:
          break;
      }
      return { success: true } as RestResult200;
    } catch (error) {
      this._tools.Logger.error(() => `[EngineChatManagerHandler].execute: Chat Manager encountered an error: ${error}`);
    }
  }



}
