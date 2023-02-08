import { HandlerTools } from '@iote/cqrs';
import { Logger } from '@iote/bricks-angular';

import { RestResult200 } from '@ngfi/functions';

import { ChatStatus, EndUser } from '@app/model/convs-mgr/conversations/chats';
import { Message, MessageDirection } from '@app/model/convs-mgr/conversations/messages';

import { ConnectionsDataService } from './services/data-services/connections.service';
import { CursorDataService } from './services/data-services/cursor.service';
import { BlockDataService } from './services/data-services/blocks.service';
import { BotEnginePlay } from './services/bot-engine-play.service';
import { MessagesDataService } from './services/data-services/messages.service';
import { EndUserDataService } from './services/data-services/end-user.service';

import { ActiveChannel } from './model/active-channel.service';

import { generateEndUserId } from './utils/generateUserId';
import { ProcessMessageService } from './services/process-message/process-message.service';
import { createTextMessage } from './utils/createTextMessage.util';
import { BotMediaProcessService } from './services/media/process-media-service';


/**
 * This model is responsible for the flow of chat messages between our bot and
 *    an end user (which is an identifiable user that is sending messages over a specific channel)
 *
 * The model receives the message, processes it and formulates a response (if applicable).
 */
export class EngineBotManager 
{
  orgId: string;

  endUser: EndUser;

  _endUserService$: EndUserDataService;

  sideOperations: Promise<any>[] = [];

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
    this._logger.log(() => `Engine started!!!`);

    this._logger.log(() => `Processing message ${JSON.stringify(message)}.`);

    try {
      // Set the Organisation Id
      this.orgId = this._activeChannel.channel.orgId;

      // STEP 1: Initialize the services which are necessary for execution of the bot engine
      // TODO: use a DI container to manage instances and dynamically inject appropriate dependencies

      const processMediaService = new BotMediaProcessService(this._tools);

      const connDataService = new ConnectionsDataService(this._activeChannel.channel, this._tools);
      const blockDataService = new BlockDataService(this._activeChannel.channel, connDataService, this._tools);
      const cursorDataService = new CursorDataService(this._tools);
      const _msgDataService$ = new MessagesDataService(this._tools);
      const processMessageService = new ProcessMessageService(cursorDataService, connDataService, blockDataService, this._tools, this._activeChannel, processMediaService);

      this._endUserService$ = new EndUserDataService(this._tools, this.orgId);

      const END_USER_ID = generateEndUserId(message, this._activeChannel.channel.type, this._activeChannel.channel.n);

      if(!this.endUser) {
        this.endUser = await this._endUserService$.getOrCreateEndUser(END_USER_ID, message.endUserPhoneNumber);
      }

      //TODO: Find a better way because we are passing the active channel twice
      // const bot = new BotEngineMainService(blockDataService, connDataService, _msgDataService$, cursorDataService, this._tools, this._activeChannel, botMediaUploadService);
      const bot = new BotEnginePlay(processMessageService, cursorDataService, _msgDataService$,processMediaService, this._activeChannel, this._tools);
      // STEP 2: Get the current end user information
      // This information contains the phone number and the chat status of the ongoing communication.
      //    The chat status enables us to manage the conversation of the end user and the chatbot.

      // Get the last saved end user position in the story
      const currentCursor = await cursorDataService.getLatestCursor(this.endUser.id, this.orgId);

      this._tools.Logger.log(() => `[EngineBotManager].run - Current chat status: ${this.endUser.status}`);

      // STEP 3: Process the message
      //         Because the status of the chat can change anytime, we use the current status
      //          to determine how we are going to process the message and reply to the end user
      switch (this.endUser.status) {
        case ChatStatus.Running:
          message.direction = MessageDirection.TO_CHATBOT;

          await bot.play(message, this.endUser, currentCursor);

          break;
        case ChatStatus.Paused:
          // TODO: resolve paused flow
          const pauseTextMessage = createTextMessage("Chat has been paused");

          // await bot.sendMessage(pauseTextMessage);

          break;
        case ChatStatus.TakingToAgent:
          message.direction = MessageDirection.TO_AGENT;

          // Save the message to the database for later use
          await _msgDataService$.saveMessage(message, this.orgId, this.endUser.id);
          break;
        default:
          break;
      }
      return { success: true } as RestResult200;
    } catch (error) {
      this._tools.Logger.error(() => `[EngineChatManagerHandler].execute: Chat Manager encountered an error: ${error}`);
    }
  }

  async addSideOperation(operation: Promise<any>)
  {
    this.sideOperations.push(operation);
  }
}
