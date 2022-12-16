import { HandlerTools } from "@iote/cqrs";

import { Cursor, EndUserPosition } from "@app/model/convs-mgr/conversations/admin/system";
import { Message, MessageDirection, TextMessage } from "@app/model/convs-mgr/conversations/messages";
import { StoryBlock, StoryBlockTypes } from "@app/model/convs-mgr/stories/blocks/main";
import { EndUser } from "@app/model/convs-mgr/conversations/chats";
import { MessageTypes } from "@app/model/convs-mgr/functions";

import { CursorDataService } from "./data-services/cursor.service";
import { EndUserDataService } from "./data-services/end-user.service";
import { MessagesDataService } from "./data-services/messages.service";

import { VariableInjectorService } from "./variable-injection/variable-injector.service";
import { ProcessMessageService } from "./process-message/process-message.service";
import { BlockToStandardMessage } from "../io/block-to-message-parser.class";

import { IBotEngine } from "./bot-engine.interface";
import { ActiveChannel } from "../model/active-channel.service";

import { __isCommand } from "../utils/isCommand";

import { ChatCommandsManager } from "./chat-commands/chat-commands-manager.service";
import { BotEngineMain } from "./bot-engine.main";

export class BotEnginePlay extends BotEngineMain implements IBotEngine
{

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
    super(_msgService$, _activeChannel, _tools);

    this.defaultStory = _activeChannel.channel.defaultStory;

    this.chatCommandsManager = new ChatCommandsManager(_endUserDataService$, _activeChannel, _processMessageService$, _tools);

  }

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
    await Promise.all(sideOperations)
  }

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

  private async __reply(newStoryBlock: StoryBlock, endUser: EndUser, message: Message)
  {
    let sideOperations: Promise<any>[] = [];

    const variableInjectorService = new VariableInjectorService(this._tools);

    newStoryBlock.message = variableInjectorService.injectVariableToText(newStoryBlock.message, endUser);

    // Save the message
    sideOperations.push(this.save(message, endUser.id)) 

    // Reply
    await this._sendBlockMessage(newStoryBlock, endUser.phoneNumber)

    // Update the cursor
    const newPosition: EndUserPosition = { currentBlock: newStoryBlock };

    sideOperations.push(this.__move(newPosition, endUser.id))

    let count = 1;

    let currentBlock =  newStoryBlock;

    while (currentBlock.type === StoryBlockTypes.TextMessage || currentBlock.type == StoryBlockTypes.Image) {

      currentBlock = await this.__getNextBlock(endUser, {currentBlock});

      //Side operation
      sideOperations.push(this._saveBlockAsMessage(currentBlock, endUser.id));

      this._tools.Logger.log(() => `[EngineBotManager] - Next Block #${count} : ${JSON.stringify(currentBlock)}`);

      // Inject variable to message
      currentBlock.message = variableInjectorService.injectVariableToText(currentBlock.message, endUser);

      await this._sendBlockMessage(currentBlock, endUser.phoneNumber);

      sideOperations.push(this.__move({currentBlock: currentBlock}, endUser.id)); 

      count++;
    }

    return sideOperations
  }

  private async __move(newPosition: EndUserPosition, endUserId: string): Promise<EndUserPosition> 
  {
    return this._cursorDataService$.updateCursor(endUserId, this._activeChannel.channel.orgId, newPosition.currentBlock);
  };

  private async _sendBlockMessage(newStoryBlock: StoryBlock, phoneNumber: string)
  {
    const outgoingMessage = this._activeChannel.parseOutMessage(newStoryBlock, phoneNumber);

    return this._activeChannel.send(outgoingMessage)
  }

  private async _saveBlockAsMessage(storyBlock: StoryBlock, endUserId: string)
  {
    const botMessage = this.__convertBlockToStandardMessage(storyBlock);

    return this.save(botMessage, endUserId)
  }

  private __convertBlockToStandardMessage(nextBlock: StoryBlock)
  {
    const botMessage = new BlockToStandardMessage().convert(nextBlock);
    botMessage.direction = MessageDirection.TO_END_USER;

    return botMessage;
  }
}