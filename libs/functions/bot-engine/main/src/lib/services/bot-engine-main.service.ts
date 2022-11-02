import { HandlerTools } from '@iote/cqrs';


import { CursorDataService } from './data-services/cursor.service';
import { BlockDataService } from './data-services/blocks.service';
import { ConnectionsDataService } from './data-services/connections.service';

import { Message } from '@app/model/convs-mgr/conversations/messages';

import { ProcessMessageService } from './process-message/process-message.service';

import { StoryBlock, StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';

import { ActiveChannel } from '../model/active-channel.service';
import { TextMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { __PlatformTypeToPrefix } from '@app/model/convs-mgr/conversations/admin/system';
import { MessagesDataService } from './data-services/messages.service';

/**
 * Contains the main processes of the ChatBot
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
  ) {}

  /** Uses the base message to return the next block and send it */
  async getNextBlock(baseMessage: Message, endUserId: string) {

    // Process message and return next block
    const nextBlock = await this._getNextBlock(baseMessage, endUserId);

    return nextBlock
  }

  async sendTextMessage(text: string, phoneNumber: string){

    const textMessageBlock: TextMessageBlock = {
      type: StoryBlockTypes.TextMessage,
      position: undefined,
      deleted: false,
      blockTitle: '',
      blockIcon: '',
      message: text,
    }

    await this.reply(textMessageBlock, phoneNumber)
  }

  /**
   * Takes the inteprated message and determines the next block
   */
  private async _getNextBlock(msg: Message, endUserId: string) {
    // Pass dependencies to the Process Message Service
    const processMessage = new ProcessMessageService(this._cursorDataService$, this._connService$, this._blocksService$);

    this._tools.Logger.log(() => `[ProcessMessageHandler]._processMessage: Processing message ${JSON.stringify(msg)}.`);

    // Get the last block sent to user
    const userActivity = await this._cursorDataService$.getLatestCursor(endUserId);

    // If no block was sent then the conversation is new and we return the first block, else get the next block
    if (!userActivity) {
      return processMessage.getFirstBlock(this._tools);
    } else {
      return processMessage.resolveNextBlock(msg, endUserId, this._tools);
    }
  }

  async reply(storyBlock: StoryBlock, phoneNumber: string) 
  {
   const outgoingMessage = this._activeChannel.parseOutMessage(storyBlock, phoneNumber);

   return this._activeChannel.send(outgoingMessage);
  }

  async saveMessage(message: Message, endUserId: string){

    return this._messageDataService$.saveMessage(message, endUserId);
  }


  async updateCursor(nextBlock: StoryBlock, endUserId: string){
    // Update the cursor
    return this._cursorDataService$.updateCursor(nextBlock, endUserId);
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
    
    const n = this._activeChannel.channel.n

    return __PlatformTypeToPrefix(this._activeChannel.channel.type) + '_' + n + '_' + message.endUserPhoneNumber
  }
}
