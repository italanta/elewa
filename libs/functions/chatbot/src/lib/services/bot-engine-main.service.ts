import { HandlerTools } from '@iote/cqrs';

import { SendMessageFactory } from '@app/functions/messages/whatsapp';

import { CursorDataService } from './data-services/cursor.service';
import { BlockDataService } from './data-services/blocks.service';
import { ConnectionsDataService } from './data-services/connections.service';

import { Platforms } from '@app/model/convs-mgr/conversations/admin/system';
import { BaseMessage } from '@app/model/convs-mgr/conversations/messages';
import { BaseChannel } from '@app/model/bot/channel';
import { ProcessMessageService } from './process-message/process-message.service';

import { StoryBlock } from '@app/model/convs-mgr/stories/blocks/main';

/**
 * Contains the main processes of the ChatBot
 */
export class BotEngineMainService {
  platform: Platforms;

  constructor(
    private _blocksService$: BlockDataService,
    private _connService$: ConnectionsDataService,
    private _cursorDataService$: CursorDataService,
    private _tools: HandlerTools,
    platform: Platforms
  ) {
    this.platform = platform;
  }

  /** Uses the base message to return the next block and send it */
  async processMessage(baseMessage: BaseMessage) {

    // Process message and return next block
    const nextBlock = await this._getNextBlock(baseMessage);

    return nextBlock
  }

  async sendTextMessage(msg: BaseMessage, text: string){
    const channel = msg as BaseChannel

    const pauseMessage: BaseMessage = {
      message: text,
      phoneNumber: msg.phoneNumber,
      channelName: this.platform,
      ...channel,
    }

    await this.sendMessage({ msg: pauseMessage}, msg.phoneNumber);
  }

  /**
   * Takes the inteprated message and determines the next block
   */
  private async _getNextBlock(msg: BaseMessage) {
    // Pass dependencies to the Process Message Service
    const processMessage = new ProcessMessageService(this._cursorDataService$, this._connService$, this._blocksService$);

    this._tools.Logger.log(() => `[ProcessMessageHandler]._processMessage: Processing message ${JSON.stringify(msg)}.`);

    // Get the last block sent to user
    const userActivity = await this._cursorDataService$.getLatestCursor();

    // If no block was sent then the conversation is new and we return the first block, else get the next block
    if (!userActivity) {
      return await processMessage.getFirstBlock(this._tools);
    } else {
      return await processMessage.resolveNextBlock(msg, this._tools);
    }
  }

  /**
   * Interprets the next block to to the appropriate message type and send to user
   * @param data the base message and the block to be sent
   * @param endUserPhoneNumber - the user who is communicating with the bot
   */
  async sendMessage(data: { msg: BaseMessage; block?: StoryBlock }, endUserPhoneNumber: string) {
    this._tools.Logger.log(() => `[SendMessage]._sendMessage: preparing to send message ${JSON.stringify(data)}.`);
    // Call factory to resolve the platform
    const client = new SendMessageFactory(data.msg.platform, this._tools).resolvePlatform()

    // Send the message
    await client.sendMessage(data.msg, endUserPhoneNumber, data.block)
  }

  async updateCursor(nextBlock: StoryBlock){
    // Update the cursor
    return await this._cursorDataService$.updateCursor(nextBlock);
  }


}
