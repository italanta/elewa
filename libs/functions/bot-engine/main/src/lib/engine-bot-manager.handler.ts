import { HandlerTools } from '@iote/cqrs';
import { Logger } from '@iote/bricks-angular';

import { RestResult200 } from '@ngfi/functions';

import { ChatStatus, EndUser } from '@app/model/convs-mgr/conversations/chats';
import { FileMessage, Message, MessageDirection } from '@app/model/convs-mgr/conversations/messages';
import { isFileMessage } from '@app/model/convs-mgr/functions';
import { EnrolledEndUser } from '@app/model/convs-mgr/learners';
import { PlatformType } from '@app/model/convs-mgr/conversations/admin/system';

import { ConnectionsDataService } from './services/data-services/connections.service';
import { CursorDataService } from './services/data-services/cursor.service';
import { BlockDataService } from './services/data-services/blocks.service';
import { BotEnginePlay } from './services/bot-engine-play.service';
import { MessagesDataService } from './services/data-services/messages.service';
import { EndUserDataService } from './services/data-services/end-user.service';
import { EnrolledUserDataService } from './services/data-services/enrolled-user.service';

import { ActiveChannel } from './model/active-channel.service';

import { generateEnrolledUserId } from './utils/generateEnrolledUserId';
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

  enrolledUser: EnrolledEndUser;

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
  public async run(message: Message, endUser: EndUser)
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
      const platform = this._activeChannel.channel.type;

      // STEP 1: Initialize the services which are necessary for execution of the bot engine
      // TODO: use a DI container to manage instances and dynamically inject appropriate dependencies

      const processMediaService = new BotMediaProcessService(this._tools);

      const connDataService = new ConnectionsDataService(this._activeChannel.channel, this._tools);
      const blockDataService = new BlockDataService(this._activeChannel.channel, connDataService, this._tools);
      const cursorDataService = new CursorDataService(this._tools);
      const _msgDataService$ = new MessagesDataService(this._tools);
  
      this._endUserService$ = new EndUserDataService(this._tools, this.orgId);
      const enrolledUserService = new EnrolledUserDataService(this._tools, this.orgId);
      const processMessageService = new ProcessMessageService(cursorDataService, connDataService, blockDataService, this._tools, this._activeChannel, processMediaService);

      const END_USER_ID = endUser.id;

      // create endUser and enrolledUser equivalent.
      await this.createEndUser(endUser, enrolledUserService, platform, this._logger);

      //TODO: Find a better way because we are passing the active channel twice
      // const bot = new BotEngineMainService(blockDataService, connDataService, _msgDataService$, cursorDataService, this._tools, this._activeChannel, botMediaUploadService);
      const bot = new BotEnginePlay(processMessageService, cursorDataService, _msgDataService$,processMediaService, this._activeChannel, this._tools);
      // STEP 2: Get the current end user information
      // This information contains the phone number and the chat status of the ongoing communication.
      //    The chat status enables us to manage the conversation of the end user and the chatbot.

      // Get the last saved end user position in the story
      const currentCursor = await cursorDataService.getLatestCursor(this.endUser.id, this.orgId);

      this._tools.Logger.log(() => `[EngineBotManager].run - Current chat status: ${this.endUser.status}`);

      // STEP 2: Update the isComplete flag
      //         We need to update the isComplete flag to -1 so that the user can continue the conversation
      //         We do this here because we have successfully received the message
      await this._endUserService$.setConversationComplete(END_USER_ID, -1);

      // STEP 3: Process the message
      //         Because the status of the chat can change anytime, we use the current status
      //          to determine how we are going to process the message and reply to the end user
      switch (this.endUser.status) {
        case ChatStatus.Running:
          message.direction = MessageDirection.FROM_END_USER_TO_CHATBOT;

          await bot.play(message, this.endUser, currentCursor);

          break;
        case ChatStatus.Paused:
          // TODO: resolve paused flow
          const pauseTextMessage = createTextMessage("Chat has been paused");

          // await bot.sendMessage(pauseTextMessage);

          break;
        case ChatStatus.PausedByAgent:
          message.direction = MessageDirection.FROM_ENDUSER_TO_AGENT;

          if(isFileMessage(message.type) && !message.url) {
            message = await bot.__setFileMessageUrl(message as FileMessage, END_USER_ID);
          }

          // Save the message to the database for later use
          await _msgDataService$.saveMessage(message, this.orgId, END_USER_ID);
          break;
        default:
          message.direction = MessageDirection.FROM_END_USER_TO_CHATBOT;

          await bot.play(message, this.endUser, currentCursor);
          break;
      }
      return { success: true } as RestResult200;
    } catch (error) {
      this._tools.Logger.error(() => `[EngineChatManagerHandler].execute: Chat Manager encountered an error: ${error}`);
    }
  }

  async createEndUser(endUser: EndUser, enrolledUserService: EnrolledUserDataService, platform: PlatformType, logger:Logger) {
    logger.log(() => `Creating EndUser and Enrolled User Equivalent`);
    
    // Step 1: Get or Create End User
    // TODO: Create enrolled user first
    let enrolledUser: Promise<EnrolledEndUser>;

    this.endUser = await this._endUserService$.getEndUser(endUser.id);

    if(!this.endUser) {
      // Create an enrolled user
      const enrolledUserID = generateEnrolledUserId();
      enrolledUser = enrolledUserService.createEnrolledUser(endUser, platform, enrolledUserID);

      // Create end user 
      this.endUser = await this._endUserService$.createEndUser(endUser, enrolledUserID);
    } else if(this.endUser && !this.endUser.enrolledUserId) {

      const enrolledUserID = generateEnrolledUserId();
      enrolledUser = enrolledUserService.createEnrolledUser(endUser, platform, enrolledUserID);

      this.endUser.enrolledUserId = enrolledUserID;

      this.endUser = await this._endUserService$.updateEndUser(this.endUser);
    }

    // step 3: batch and resolve later
    this.addSideOperation(enrolledUser);
  }

  async addSideOperation(operation: Promise<any>)
  {
    this.sideOperations.push(operation);
  }
}
