import { HandlerTools } from '@iote/cqrs';

import { FileMessage, Message, TextMessage } from '@app/model/convs-mgr/conversations/messages';
import { TextMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { Cursor, __PlatformTypeToPrefix } from '@app/model/convs-mgr/conversations/admin/system';
import { StoryBlock, StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { EndUser } from '@app/model/convs-mgr/conversations/chats';
import { MessageTypes } from '@app/model/convs-mgr/functions';

import { ProcessMessageService } from './process-message/process-message.service';

import { CursorDataService } from './data-services/cursor.service';
import { BlockDataService } from './data-services/blocks.service';
import { ConnectionsDataService } from './data-services/connections.service';
import { EndUserDataService } from './data-services/end-user.service';
import { MessagesDataService } from './data-services/messages.service';

import { BotMediaProcessService } from './media/process-media-service';

import { __isCommand } from '../utils/isCommand';

import { ActiveChannel } from '../model/active-channel.service';
/**
 * For our chatbot and our code to be maintainable, we need separate the low-level operations of
 *  the chatbot from the main flow of the bot. Hence we have to implement Inversion of Control
 * 
 * @see https://en.wikipedia.org/wiki/Inversion_of_control
 * 
 * We are delegating some resposibilities to this Class so that our @see {EngineBotManager} can focus on 
 *  only the main flow of the chatbot.
 * 
 * This service defines the low-level operations that are required for our bot to work.
 */
export class BotEngineMainService 
{
  constructor(
    private _blocksService$: BlockDataService,
    private _connService$: ConnectionsDataService,
    private _msgService$: MessagesDataService,
    private _cursorDataService$: CursorDataService,
    private _tools: HandlerTools,
    private _activeChannel: ActiveChannel,
    private _mediaProcessService: BotMediaProcessService,
  ) { }

  async sendTextMessage(text: string, phoneNumber: string)
  {

    const textMessageBlock: TextMessageBlock = {
      type: StoryBlockTypes.TextMessage,
      position: undefined,
      deleted: false,
      blockTitle: '',
      blockIcon: '',
      message: text,
      storyDepth: 0
    };

    await this.reply(textMessageBlock, phoneNumber);
  }

  /**
   * Takes the inteprated message and determines the next block
   */
  async getNextBlock(msg: Message, endUser: EndUser, endUserDataService: EndUserDataService): Promise<StoryBlock>
  {
    // Get an instance of the process message service
    const processMessage = this._getProcessMessageService();

    this._tools.Logger.log(() => `[ProcessMessageHandler]._processMessage: Processing message ${JSON.stringify(msg)}.`);

    if (msg.type === MessageTypes.TEXT) {
      const textMessage = msg as TextMessage;

      if (__isCommand(textMessage.text)) return this.__processCommands(textMessage, endUser, endUserDataService, processMessage);

    }

    // Get the last block sent to user
    const userActivity = await this._cursorDataService$.getLatestCursor(endUser.id, this._activeChannel.channel.orgId);

    // If no block was sent then the conversation is new and we return the first block, else get the next block
    if (!userActivity) {
      return processMessage.getFirstBlock(this._tools, this._activeChannel.channel.orgId, this._activeChannel.channel.defaultStory);
    } else {
      let nextBlock: StoryBlock;
      let latestCursor = userActivity as Cursor;

      nextBlock = await processMessage.resolveNextBlock(msg, latestCursor.currentBlock, endUser.id, this._activeChannel.channel.orgId, endUser.currentStory, this._tools);

      return nextBlock;
    }
  }

  async getNonInputBlock(lastBlock: StoryBlock, endUser: EndUser, msg: Message)
  {
  const processMessage =  this._getProcessMessageService()

  return processMessage.resolveNextBlock(msg, lastBlock, endUser.id, this._activeChannel.channel.orgId, endUser.currentStory, this._tools)
  }

  async reply(storyBlock: StoryBlock, phoneNumber: string) 
  {
    const outgoingMessage = this._activeChannel.parseOutMessage(storyBlock, phoneNumber);

    return this._activeChannel.send(outgoingMessage);
  }

  async saveMessage(message: Message, endUserId: string)
  {
    if (message.type == MessageTypes.AUDIO || message.type == MessageTypes.VIDEO || message.type == MessageTypes.IMAGE) {
      const fileMessage = message as FileMessage;

      fileMessage.url = await this._mediaProcessService.processMediaFile(message, endUserId, this._activeChannel) || null;

      message = fileMessage;
    }

    await this._msgService$.saveMessage(message, this._activeChannel.channel.orgId, endUserId)
  }

  async updateCursor(endUserId: string, nextBlock: StoryBlock, futureBlock?: StoryBlock)
  {
    // Update the cursor
    return this._cursorDataService$.updateCursor(endUserId, this._activeChannel.channel.orgId, nextBlock, futureBlock);
  }

  private _getProcessMessageService()
  {
    return new ProcessMessageService(this._cursorDataService$, this._connService$, this._blocksService$, this._tools);
  }


  private async __processCommands(msg: TextMessage, endUser: EndUser, endUserDataService: EndUserDataService, processMessage: ProcessMessageService)
  {
    if (msg.text === '#init') {
      return this._resetChat(endUser, endUserDataService, processMessage);
    }
  }

  private async _resetChat(endUser: EndUser, endUserService: EndUserDataService, processMessage: ProcessMessageService)
  {

    const firstUserStory: EndUser = {
      ...endUser,
      currentStory: this._activeChannel.channel.defaultStory
    };

    await endUserService.updateEndUser(firstUserStory);

    return processMessage.getFirstBlock(this._tools, this._activeChannel.channel.orgId, this._activeChannel.channel.defaultStory);
  }

}
