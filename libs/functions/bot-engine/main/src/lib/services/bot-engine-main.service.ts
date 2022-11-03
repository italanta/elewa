import { HandlerTools } from '@iote/cqrs';

import { Message } from '@app/model/convs-mgr/conversations/messages';
import { TextMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { __PlatformTypeToPrefix } from '@app/model/convs-mgr/conversations/admin/system';
import { StoryBlock, StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';

import { ProcessMessageService } from './process-message/process-message.service';

import { MessagesDataService } from './data-services/messages.service';
import { CursorDataService } from './data-services/cursor.service';
import { BlockDataService } from './data-services/blocks.service';
import { ConnectionsDataService } from './data-services/connections.service';

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
    private _cursorDataService$: CursorDataService,
    private _messageDataService$: MessagesDataService,
    private _tools: HandlerTools,
    private _activeChannel: ActiveChannel,
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
    };

    await this.reply(textMessageBlock, phoneNumber);
  }

  /**
   * Takes the inteprated message and determines the next block
   */
  async getNextBlock(msg: Message, endUserId: string): Promise<StoryBlock>
  {
    // Get an instance of the process message service
    const processMessage = this._getProcessMessageService();

    this._tools.Logger.log(() => `[ProcessMessageHandler]._processMessage: Processing message ${JSON.stringify(msg)}.`);

    // Get the last block sent to user
    const userActivity = await this._cursorDataService$.getLatestCursor(endUserId, this._activeChannel.channel.orgId);

    // If no block was sent then the conversation is new and we return the first block, else get the next block
    if (!userActivity) {
      return processMessage.getFirstBlock(this._tools);
    } else {
      return processMessage.resolveNextBlock(msg, endUserId, this._activeChannel.channel.orgId, this._tools);
    }
  }

  async getFutureBlock(currentBlock: StoryBlock, msg: Message): Promise<StoryBlock>
  {
    const processMessageService = this._getProcessMessageService();

    if (currentBlock.type !== StoryBlockTypes.QuestionBlock) {
      return processMessageService.resolveFutureBlock(currentBlock, msg);
    }
  }
  async reply(storyBlock: StoryBlock, phoneNumber: string) 
  {
    const outgoingMessage = this._activeChannel.parseOutMessage(storyBlock, phoneNumber);

    return this._activeChannel.send(outgoingMessage);
  }

  async saveMessage(message: Message, endUserId: string)
  {

    return this._messageDataService$.saveMessage(message, this._activeChannel.channel.orgId, endUserId);
  }


  async updateCursor(endUserId: string, nextBlock: StoryBlock, futureBlock?: StoryBlock)
  {
    // Update the cursor
    return this._cursorDataService$.updateCursor(endUserId, this._activeChannel.channel.orgId, nextBlock, futureBlock);
  }

  /** Generate the end user id in the format `{platform}_{n}_{end-user-ID}`
  * 
  * 
  * @note The IDs of incoming end-users are prepended following the format:
  *          `{platform}_{n}_{end-user-ID}` with n being the n'th connection that an
  *          organisation is making to the same platform.
  */
  generateEndUserId(message: Message): string 
  {

    const n = this._activeChannel.channel.n;

    return __PlatformTypeToPrefix(this._activeChannel.channel.type) + '_' + n + '_' + message.endUserPhoneNumber;
  }

  private _getProcessMessageService()
  {
    return new ProcessMessageService(this._cursorDataService$, this._connService$, this._blocksService$, this._tools);
  }

}
