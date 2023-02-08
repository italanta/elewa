import { HandlerTools } from "@iote/cqrs";

import { Cursor } from "@app/model/convs-mgr/conversations/admin/system";
import { FileMessage, Message, MessageDirection, TextMessage } from "@app/model/convs-mgr/conversations/messages";
import { isOutputBlock, StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";
import { EndUser } from "@app/model/convs-mgr/conversations/chats";
import { isFileMessage, MessageTypes } from "@app/model/convs-mgr/functions";

import { CursorDataService } from "./data-services/cursor.service";
import { MessagesDataService } from "./data-services/messages.service";

import { MailMergeVariables } from "./variable-injection/mail-merge-variables.service";
import { ProcessMessageService } from "./process-message/process-message.service";
import { BlockToStandardMessage } from "../io/block-to-message-parser.class";
import { ChatCommandsManager } from "./chat-commands/chat-commands-manager.service";
import { BotMediaProcessService } from "./media/process-media-service";

import { IBotEnginePlay } from "./bot-engine.interface";
import { ActiveChannel } from "../model/active-channel.service";

import { __isCommand } from "../utils/isCommand";

/**
 * When out chatbot receives a message from the end user, we need to figure out how to
 *  respond back to them.
 * 
 * This model is resposible for 'playing' the end user through the stories. @see {Story}.
 *  It receives the message and responds with the next block in the story.
 */
export class BotEnginePlay implements IBotEnginePlay
{
  private orgId: string;

  private defaultStory: string;

  private chatCommandsManager: ChatCommandsManager;

  sideOperations: Promise<any>[] = [];

  constructor(
    private _processMessageService$: ProcessMessageService,
    private _cursorDataService$: CursorDataService,
    protected _msgService$: MessagesDataService,
    private _processMediaService$: BotMediaProcessService,
    protected _activeChannel: ActiveChannel,
    protected _tools: HandlerTools) 
  {
    this.defaultStory = _activeChannel.channel.defaultStory;

    this.orgId = _activeChannel.channel.orgId;

    this.chatCommandsManager = new ChatCommandsManager(_activeChannel, _processMessageService$, _tools);

  }

  /**
   * When out chatbot receives a message from the end user, we need to figure out how to
   *  respond back to them.
   * 
   * This method is resposible for 'playing' the end user through the stories. @see {Story}.
   *  It receives the message and responds with the next block in the story.
   */
  async play(message: Message, endUser: EndUser, currentCursor: Cursor | boolean)
  {
    // Save the message (batches the message to be saved to firebase later)
    this._saveEndUserMessage(message, endUser.id);

    // Get the next block in the story
    const { nextBlock, newCursor } = await this.__getNextBlock(endUser, currentCursor, message);

    // Send the block back to the user
    //
    // The chatbot has some asynchronous operations (which we dont have to wait for, in order to process the message) 
    //      e.g. saving the messages to firebase 
    // 
    // So, to ensure faster response to end users, we store all these operations to an array and resolve 
    //      them after we have responded to the user
    await this.__reply(nextBlock, endUser, message);

    this.__move(newCursor, endUser.id);

    // Here is where the message chaining happens. 
    //  If it is not an input block we replay until we get hit an input block. 
    if (isOutputBlock(nextBlock.type)) {
      return await this.play(null, endUser, newCursor);
    }

    const processMessageOps = this._processMessageService$.getSideOperations();

    this.addSideOperations(processMessageOps);
    
    // Resolve all pending operations.
    await Promise.all(this.sideOperations);
  }

  /**
   * Responsible for returning the next block in the story.
   */
  private async __getNextBlock(endUser: EndUser, currentPosition: Cursor | boolean, message?: Message)
  {

    this._tools.Logger.log(() => `[BotEnginePlay].__getNextBlock: Getting the next block... ${JSON.stringify(currentPosition)}`);

    if (message && message.type === MessageTypes.TEXT) {
      const textMessage = message as TextMessage;

      if (__isCommand(textMessage.text)) return this.chatCommandsManager.parseCommand(textMessage, endUser);

    }

    if (!currentPosition) {

      this._tools.Logger.log(() => `[BotEnginePlay].__getNextBlock: New conversation, getting the first block instead.`);
      // If the end user position does not exist then the conversation is new and we return the first block
      return this._processMessageService$.getFirstBlock(this._tools, this.orgId, this.defaultStory);
    } else {
      const endUserPosition = currentPosition as Cursor;
      const currentStory  = endUserPosition.position.storyId;

      // If the end user exists, then we continue the story by returning the next block.
      return this._processMessageService$.resolveNextBlock(message, endUserPosition, endUser.id, this.orgId, currentStory, this._tools);
    }
  }

  private async __reply(nextBlock: StoryBlock, endUser: EndUser, message?: Message)
  {

    // Inject Variables to the block
    const mailMergedBlock = await this.__mailMergeVariables(nextBlock, endUser.id);

    this._tools.Logger.log(() => `Block to be sent: ${JSON.stringify(mailMergedBlock)}`)

    // Save block to messages collection
    this._saveBlockAsMessage(mailMergedBlock, endUser.id);

    // Reply To the end user
    await this._sendBlockMessage(mailMergedBlock, endUser.phoneNumber);
  }

  private async __mailMergeVariables(storyBlock: StoryBlock, endUserId: string) 
  {
    const newBlock = storyBlock;
    // Initialize the variable injector service
    const mailMergeVariables = new MailMergeVariables(this._tools);

    // Find and replace any variables included in the block message
    if(newBlock.message) newBlock.message = await mailMergeVariables.merge(storyBlock.message, this.orgId, endUserId);

    return newBlock;
  }

  /**
   * Updates the position of the end user with the block we send back to them
   */
  private __move(newPosition: Cursor, endUserId: string)
  {
    const moveCursor = this._cursorDataService$.updateCursor(endUserId, this._activeChannel.channel.orgId, newPosition);

    this.sideOperations.push(moveCursor);
  };

  /**
   * Parses @see StoryBlock and sends it as a message to the end user.
   */
  private async _sendBlockMessage(newStoryBlock: StoryBlock, phoneNumber: string)
  {
    const outgoingMessage = this._activeChannel.parseOutMessage(newStoryBlock, phoneNumber);

    return this._activeChannel.send(outgoingMessage);
  }

  /**
   * Converts the block to our standardized message @see {Message} and saves it to the database
   */
  private async _saveBlockAsMessage(storyBlock: StoryBlock, endUserId: string)
  {
    const botMessage = this.__convertBlockToStandardMessage(storyBlock);

    const saveMessage = this.__save(botMessage, endUserId);

    this.sideOperations.push(saveMessage);
  }

  private async __save(message: Message, endUserId: string) 
  {
      return this._msgService$.saveMessage(message, this.orgId, endUserId);
  };

  private async _saveEndUserMessage (message: Message, endUserId: string) {
    if(!message) return;

    if(isFileMessage(message.type) && !message.url) {
      message = await this.__setFileMessageUrl(message as FileMessage, endUserId);
    }
    const saveEndUserMessage = this.__save(message, endUserId);

    this.sideOperations.push(saveEndUserMessage);
  }

  private async __setFileMessageUrl(msg: FileMessage, endUserId: string) { 

    msg.url = await this._processMediaService$.getFileURL(msg, endUserId, this._activeChannel) || null;

    return msg;
  }

  /**
   * Converts the block to our standardized message @see {Message} so that we can have a common message
   *  structure that can easily be ready by third party applications
   */
  private __convertBlockToStandardMessage(nextBlock: StoryBlock)
  {
    const botMessage = new BlockToStandardMessage().convert(nextBlock);
    botMessage.direction = MessageDirection.TO_END_USER;

    return botMessage;
  }

  async addSideOperations(operations: Promise<any>[])
  {
    this.sideOperations.push(...operations);
  }
}