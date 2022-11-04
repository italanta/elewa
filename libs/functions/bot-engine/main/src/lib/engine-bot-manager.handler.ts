import { HandlerTools } from '@iote/cqrs';
import { Logger } from '@iote/bricks-angular';
import { RestResult200 } from '@ngfi/functions';

import { ChatStatus, EndUser } from '@app/model/convs-mgr/conversations/chats';
import { Message } from '@app/model/convs-mgr/conversations/messages';
import { __PlatformTypeToPrefix } from '@app/model/convs-mgr/conversations/admin/system';

import { ConnectionsDataService } from './services/data-services/connections.service';
import { CursorDataService } from './services/data-services/cursor.service';
import { BlockDataService } from './services/data-services/blocks.service';
import { BotEngineMainService } from './services/bot-engine-main.service';
import { MessagesDataService } from './services/data-services/messages.service';
import { EndUserDataService } from './services/data-services/end-user.service';

import { ActiveChannel } from './model/active-channel.service';

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
   * STEP 2: Get the current end user information.
   * STEP 3: Process the message
   *
   * @param {IncomingMessage} message - An sanitized incoming message from a third-party provider.
   * @returns A REST 200/500 response so the third-party provider knows the message arrived well/failed.
   */
  public async run(message: Message) 
  {
    /**
     * The chatbot has some asynchronous operations (which we dont have to wait for, in order to process the message) e.g. saving the messages to firebase
     * 
     * So, to ensure faster response to end users, we store all these operations to an array and resolve them after we have responded to the user
     */
    let sideOperations: Promise<any>[] = [];

    this._logger.log(() => `Processing message ${JSON.stringify(message)}.`);

    try {
      // STEP 1: Initialize the services which are necessary for execution of the bot engine
      // TODO: use a DI container to manage instances and dynamically inject appropriate dependencies

      const connDataService = new ConnectionsDataService(this._activeChannel.channel, this._tools);
      const blockDataService = new BlockDataService(this._activeChannel.channel, connDataService, this._tools);
      const cursorDataService = new CursorDataService(this._tools);
      const _msgDataService$ = new MessagesDataService(this._tools);

      const _endUserService$ = new EndUserDataService(this._tools, this._activeChannel.channel.orgId);

      //TODO: Find a better way because we are passing the active channel twice
      const bot = new BotEngineMainService(blockDataService, connDataService, cursorDataService, _msgDataService$, this._tools, this._activeChannel);

      // STEP 2: Get the current end user information
      // This information contains the phone number and the chat status of the ongoing communication.
      //    The chat status enables us to manage the conversation of the end user and the chatbot.
      
      // Generate the id of the end user
      const END_USER_ID = bot.generateEndUserId(message);
      
      // Get the saved information of the end user
      const endUser = await this._getEndUser(END_USER_ID, message.endUserPhoneNumber, _endUserService$)

     this._tools.Logger.log(() => `[EngineBotManager].run - Current chat status: ${endUser.status}`);

      // Save the message to the database for later use
      sideOperations.push(bot.saveMessage(message, END_USER_ID));

      // STEP 3: Process the message
      //         Because the status of the chat can change anytime, we use the current status
      //          to determine how we are going to process the message and reply to the end user
      switch (endUser.status) {
        case ChatStatus.Running:
          // Process the message and find the next block in the story that is to be sent back to the user
          const nextBlock = await bot.getNextBlock(message, END_USER_ID);

          // Send the block back to the user
          await bot.reply(nextBlock, message.endUserPhoneNumber);

          // If the block sent back to the user is not a question block, then we know the next block regardless
          //    of their reponse. 
          // So we compute the next block now and save it to the cursor
          const futureBlock = await bot.getFutureBlock(nextBlock, message);

          // Update the cursor
          sideOperations.push(bot.updateCursor(END_USER_ID, nextBlock, futureBlock));

          // Finally Resolve pending operations that do not affect the processing of the message
          await Promise.all(sideOperations);

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

  /**
   * Gets the end user information from the database or creates a new end user if the user does not exist
   */
  private async _getEndUser(END_USER_ID: string, phoneNumber: string, _endUserService$: EndUserDataService)
  {
    let endUser: EndUser;

    endUser = await _endUserService$.getEndUser(END_USER_ID);

    // If the end user does not exist then we create a new end user
    if (!endUser) {
      return _endUserService$.createEndUser(END_USER_ID, phoneNumber);
    }

    return endUser
  }

}
