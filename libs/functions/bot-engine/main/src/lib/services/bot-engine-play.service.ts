import { HandlerTools } from "@iote/cqrs";

import { Cursor, EndUserPosition } from "@app/model/convs-mgr/conversations/admin/system";
import { FileMessage, Message, MessageDirection, TextMessage } from "@app/model/convs-mgr/conversations/messages";
import { StoryBlock, StoryBlockTypes } from "@app/model/convs-mgr/stories/blocks/main";
import { EndUser } from "@app/model/convs-mgr/conversations/chats";
import { MessageTypes } from "@app/model/convs-mgr/functions";

import { CursorDataService } from "./data-services/cursor.service";
import { EndUserDataService } from "./data-services/end-user.service";
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

  constructor(
    private _processMessageService$: ProcessMessageService,
    private _cursorDataService$: CursorDataService,
    protected _msgService$: MessagesDataService,
    private _endUserDataService$: EndUserDataService,
    protected _activeChannel: ActiveChannel,
    protected _tools: HandlerTools) 
  {
    this.defaultStory = _activeChannel.channel.defaultStory;

    this.orgId = _activeChannel.channel.orgId;

    this.chatCommandsManager = new ChatCommandsManager(_endUserDataService$, _activeChannel, _processMessageService$, _tools);

  }

  /**
   * When out chatbot receives a message from the end user, we need to figure out how to
   *  respond back to them.
   * 
   * This method is resposible for 'playing' the end user through the stories. @see {Story}.
   *  It receives the message and responds with the next block in the story.
   */
  async play(message: Message, endUser: EndUser, endUserPosition?: Cursor)
  {
    // Get the next block in the story
    const nextBlock = await this.__getNextBlock(endUser, endUserPosition, message);

    // Send the block back to the user
    //
    // The chatbot has some asynchronous operations (which we dont have to wait for, in order to process the message) 
    //      e.g. saving the messages to firebase 
    // 
    // So, to ensure faster response to end users, we store all these operations to an array and resolve 
    //      them after we have responded to the user
    const sideOperations = await this.__reply(nextBlock, endUser, message);

    // Resolve all pending operations.
    await Promise.all(sideOperations);
  }

  /**
   * Responsible for returning the next block in the story.
   */
  private async __getNextBlock(endUser: EndUser, endUserPosition: EndUserPosition, message?: Message)
  {
    const currentStory = endUser.currentStory;

    const lastBlock = endUserPosition.currentBlock;

    this._tools.Logger.log(() => `[ProcessMessageHandler]._processMessage: Processing message ${JSON.stringify(message)}.`);

    if (message && message.type === MessageTypes.TEXT) {
      const textMessage = message as TextMessage;

      if (__isCommand(textMessage.text)) return this.chatCommandsManager.parseCommand(textMessage, endUser);

    }

    if (!endUserPosition) {
      // If the end user position does not exist then the conversation is new and we return the first block
      return this._processMessageService$.getFirstBlock(this._tools, this.orgId, this.defaultStory);
    } else {
      // If the end user exists, then we continue the story by returning the next block.
      return this._processMessageService$.resolveNextBlock(lastBlock, endUser.id, this.orgId, currentStory, this._tools, message);
    }
  }

  /**
   * Handles sending of story blocks to the end user.
   * 
   * If the next block does not require a user input e.g. text message block, we chain it with another block, until we 
   *  reach a block requiring user input e.g. question message block
   */
  private async __reply(newStoryBlock: StoryBlock, endUser: EndUser, message: Message)
  {
    /**
     * The chatbot has some asynchronous operations (which we dont have to wait for, in order to process the message) 
     *     e.g. saving the messages to firebase 
     * 
     * So, to ensure faster response to end users, we store all these operations to an array and resolve 
     *     them after we have responded to the user
     */
    let sideOperations: Promise<any>[] = [];

    // Initialize the variable injector service
    const mailMergeVariables = new MailMergeVariables(this._tools);

    // Find and replace any variables included in the block message
    newStoryBlock.message = mailMergeVariables.merge(newStoryBlock.message, endUser);
    const saveMessage = this.__save(message, endUser.id);

    // Save the message
    sideOperations.push(saveMessage);

    // Reply To the end user
    await this._sendBlockMessage(newStoryBlock, endUser.phoneNumber);

    // Update the End User Position
    const newPosition: EndUserPosition = { currentBlock: newStoryBlock };
    const moveToNext = this.__move(newPosition, endUser.id);

    sideOperations.push(moveToNext);

    let count = 1;

    let currentBlock = newStoryBlock;

    // Here is where the message chaining happens. 
    //  If it is a text block we find the next block and send it. 
    //    Our loop ends when we hit a story block type that is not specified here.
    while (currentBlock.type === StoryBlockTypes.TextMessage || currentBlock.type == StoryBlockTypes.Image) {

      // Get the next block in the story
      currentBlock = await this.__getNextBlock(endUser, { currentBlock });

      const saveBlockAsMessage = this._saveBlockAsMessage(currentBlock, endUser.id);

      // Save the message
      sideOperations.push(saveBlockAsMessage);

      this._tools.Logger.log(() => `[EngineBotManager] - Next Block #${count} : ${JSON.stringify(currentBlock)}`);

      // Inject variable to message
      currentBlock.message = mailMergeVariables.merge(currentBlock.message, endUser);

      // Send the message back to the end user
      await this._sendBlockMessage(currentBlock, endUser.phoneNumber);

      // Update the End User Position
      const moveToNext = this.__move({ currentBlock: currentBlock }, endUser.id);

      sideOperations.push(moveToNext);

      count++;
    }

    return sideOperations;
  }

  /**
   * Updates the position of the end user with the block we send back to them
   */
  private async __move(newPosition: EndUserPosition, endUserId: string): Promise<EndUserPosition> 
  {
    return this._cursorDataService$.updateCursor(endUserId, this._activeChannel.channel.orgId, newPosition.currentBlock);
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

    return this.__save(botMessage, endUserId);
  }

  private async __save(message: Message, endUserId: string) 
  {
    const processMediaService = new BotMediaProcessService(this._tools);

    if (message.type == MessageTypes.AUDIO || message.type == MessageTypes.VIDEO || message.type == MessageTypes.IMAGE) {
      const fileMessage = message as FileMessage;

      fileMessage.url = await processMediaService.processMediaFile(message, endUserId, this._activeChannel) || null;

      message = fileMessage;
    }
    return this._msgService$.saveMessage(message, this.orgId, endUserId);
  };

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
}