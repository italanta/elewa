import { HandlerTools } from '@iote/cqrs';
import { Logger } from '@iote/bricks-angular';

import { RestResult200 } from '@ngfi/functions';

import { ChatStatus, EndUser } from '@app/model/convs-mgr/conversations/chats';
import { Message, MessageDirection } from '@app/model/convs-mgr/conversations/messages';
import { __PlatformTypeToPrefix } from '@app/model/convs-mgr/conversations/admin/system';
import { StoryBlock, StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';

import { ConnectionsDataService } from './services/data-services/connections.service';
import { CursorDataService } from './services/data-services/cursor.service';
import { BlockDataService } from './services/data-services/blocks.service';
import { BotEngineMainService } from './services/bot-engine-main.service';
import { MessagesDataService } from './services/data-services/messages.service';
import { EndUserDataService } from './services/data-services/end-user.service';

import { ActiveChannel } from './model/active-channel.service';
import { BlockToStandardMessage } from './io/block-to-message-parser.class';
import { BotMediaProcessService } from './services/media/process-media-service';
import { generateEndUserId } from './utils/generateUserId';


/**
 * This model is responsible for the flow of chat messages between our bot and
 *    an end user (which is an identifiable user that is sending messages over a specific channel)
 *
 * The model receives the message, processes it and formulates a response (if applicable).
 */
export class EngineBotManager 
{
  _endUserService$: EndUserDataService;

  constructor(private _tools: HandlerTools, private _logger: Logger, private _activeChannel: ActiveChannel) { }

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

    let nextBlock: StoryBlock;

    this._logger.log(() => `Processing message ${JSON.stringify(message)}.`);

    try {
      // STEP 1: Initialize the services which are necessary for execution of the bot engine
      // TODO: use a DI container to manage instances and dynamically inject appropriate dependencies

      const connDataService = new ConnectionsDataService(this._activeChannel.channel, this._tools);
      const blockDataService = new BlockDataService(this._activeChannel.channel, connDataService, this._tools);
      const cursorDataService = new CursorDataService(this._tools);
      const _msgDataService$ = new MessagesDataService(this._tools);
      const botMediaUploadService = new BotMediaProcessService(this._tools);

      this._endUserService$ = new EndUserDataService(this._tools, this._activeChannel.channel.orgId);

      //TODO: Find a better way because we are passing the active channel twice
      const bot = new BotEngineMainService(blockDataService, connDataService, cursorDataService, _msgDataService$, botMediaUploadService, this._tools, this._activeChannel);

      // STEP 2: Get the current end user information
      // This information contains the phone number and the chat status of the ongoing communication.
      //    The chat status enables us to manage the conversation of the end user and the chatbot.

      // Generate the id of the end user
      const END_USER_ID = generateEndUserId(message, this._activeChannel.channel.type, this._activeChannel.channel.n);

      // Get the saved information of the end user
      const endUser = await this._getEndUser(END_USER_ID, message.endUserPhoneNumber);

      this._tools.Logger.log(() => `[EngineBotManager].run - Current chat status: ${endUser.status}`);

      // STEP 3: Process the message
      //         Because the status of the chat can change anytime, we use the current status
      //          to determine how we are going to process the message and reply to the end user
      switch (endUser.status) {
        case ChatStatus.Running:
          message.direction = MessageDirection.TO_CHATBOT;

          // Save the message to the database for later use
          sideOperations.push(bot.saveMessage(message, END_USER_ID));

          // Process the message and find the next block in the story that is to be sent back to the user
          nextBlock = await bot.getNextBlock(message, endUser.id);

          const botMessage = this.__getBotMessage(nextBlock);
          botMessage.direction = MessageDirection.TO_END_USER;

          sideOperations.push(bot.saveMessage(botMessage, END_USER_ID));

          const newEndUser = await this._getEndUser(END_USER_ID, message.endUserPhoneNumber);
          // Reply to the end user
          await this._reply(bot, newEndUser, sideOperations, nextBlock, message);

          // Finally Resolve pending operations that do not affect the processing of the message
          await Promise.all(sideOperations);

          break;
        case ChatStatus.Paused:
          await bot.sendTextMessage("Chat has been paused", message.endUserPhoneNumber);
          break;
        case ChatStatus.TakingToAgent:
          message.direction = MessageDirection.TO_AGENT;

          // Save the message to the database for later use
          await bot.saveMessage(message, END_USER_ID);
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
   * Sends the message back to the user,
   * 
   * If the next block does not require a user input e.g. text message block, we chain it with another block, until we 
   *  reach a block requiring user input e.g. question message block
   */

  private async _reply(bot: BotEngineMainService, endUser: EndUser, sideOperations: Promise<any>[], nextBlock: StoryBlock, message: Message)
  {
    const endUserService = new EndUserDataService(this._tools, this._activeChannel.channel.orgId);
    nextBlock.message = this.__injectVariable(nextBlock.message, endUser);

    this._tools.Logger.log(() => `[EngineBotManager] - Block to be sent ${JSON.stringify(nextBlock)}`);
    // Send the block back to the user
    await bot.reply(nextBlock, message.endUserPhoneNumber);

    // Update the cursor
    let count = 1;
    sideOperations.push(bot.updateCursor(endUser.id, nextBlock));

    while (nextBlock.type === StoryBlockTypes.TextMessage || nextBlock.type == StoryBlockTypes.Image) {

      nextBlock = await bot.getFutureBlock(nextBlock, message);

      const botMessage = this.__getBotMessage(nextBlock);

      sideOperations.push(bot.saveMessage(botMessage, endUser.id));

      this._tools.Logger.log(() => `[EngineBotManager] - Next Block #${count} : ${JSON.stringify(nextBlock)}`);

      if (nextBlock.message) nextBlock.message = this.__injectVariable(nextBlock.message, endUser);

      await bot.reply(nextBlock, message.endUserPhoneNumber);

      sideOperations.push(bot.updateCursor(endUser.id, nextBlock));
      count++;
    }
  }

  /**
   * Gets the end user information from the database or creates a new end user if the user does not exist
   */
  private async _getEndUser(END_USER_ID: string, phoneNumber: string)
  {
    let endUser: EndUser;

    endUser = await this._endUserService$.getEndUser(END_USER_ID);

    // If the end user does not exist then we create a new end user
    if (!endUser) {
      return this._endUserService$.createEndUser(END_USER_ID, phoneNumber, this._activeChannel.channel.defaultStory);
    }

    return endUser;
  }

  /**
   * For a better user experience and validation, we would need to respond back to the end user with
   *  their input. So, while creating blocks we can defined these variables in the in the format {{variable_name}}
   *  
   * With this we can then replace the message to be sent back to the user with the appropriate data
   * 
   * The name of the variable has to be the same as the property name of the variable in the object being passed.
   *    e.g. Considering the endUser object is { name: 'Reagan' }, to insert 'name' to an outgoing text, 
   *          we add the text to the block as 'Hello {{name}}'
   * 
   */
  protected __injectVariable(outgoingText: string, dataSource: any): string
  {
    // Regex to extract the variable between the {{}} curly braces
    const varRegex = new RegExp('\{{(.*?)\}}');

    // Extract the variable
    const variable = varRegex.exec(outgoingText);

    // Replace the variable with the appropriate information
    if (variable) {
      return outgoingText.replace(`{{${variable[1]}}}`, dataSource[variable[1]]);
    }
    return outgoingText;
  }

  protected __getBotMessage(nextBlock: StoryBlock)
  {
    const botMessage = new BlockToStandardMessage().convert(nextBlock);
    botMessage.direction = MessageDirection.TO_END_USER;

    return botMessage;
  }
}
