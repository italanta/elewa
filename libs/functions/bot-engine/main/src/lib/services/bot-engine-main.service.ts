import { HandlerTools } from '@iote/cqrs';

import { SendMessageFactory } from '@app/functions/messages/whatsapp';

import { CursorDataService } from './data-services/cursor.service';
import { BlockDataService } from './data-services/blocks.service';
import { ConnectionsDataService } from './data-services/connections.service';

import { PlatformType } from '@app/model/convs-mgr/conversations/admin/system';
import { Message } from '@app/model/convs-mgr/conversations/messages';
import { BaseChannel } from '@app/model/bot/channel';
import { ProcessMessageService } from './process-message/process-message.service';

import { StoryBlock, StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { SendMessageInterpreterFactory } from './interpreter/send-message-interpreter/send-interpreter.factory';

/**
 * Contains the main processes of the ChatBot
 */
export class BotEngineMainService {
  platform: PlatformType;

  constructor(
    private _blocksService$: BlockDataService,
    private _connService$: ConnectionsDataService,
    private _cursorDataService$: CursorDataService,
    private _tools: HandlerTools,
    platform: PlatformType
  ) {
    this.platform = platform;
  }

  /** Uses the base message to return the next block and send it */
  async processMessage(baseMessage: Message) {

    // Process message and return next block
    const nextBlock = await this._getNextBlock(baseMessage);

    return nextBlock
  }

  async sendTextMessage(msg: Message, text: string, channel: BaseChannel){

    const pauseMessage: Message = {
      message: text,
      phoneNumber: msg.phoneNumber,
      channelName: this.platform,
      ...channel,
    }

    await this.sendMessage({ msg: pauseMessage}, channel);
  }

  /**
   * Takes the inteprated message and determines the next block
   */
  private async _getNextBlock(msg: Message) {
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
  async sendMessage(data: { msg: Message; block?: StoryBlock }, channel: BaseChannel) {
    this._tools.Logger.log(() => `[SendMessage]._sendMessage: preparing to send block ${JSON.stringify(data)}.`);

    const blockType = data.block.type || StoryBlockTypes.TextMessage

    // Resolve the message interpreter
    const interpretBlock = new SendMessageInterpreterFactory().resolvePlatform(data.msg.platform).interpretBlock(blockType)

    // Generate the payload required by the API
    const payload = interpretBlock(data.msg, data.block)

    // Resolve the client for sending the message
    const client = new SendMessageFactory(data.msg.platform, this._tools).resolvePlatform()

    // Send the message
    await client.sendMessage(payload, channel)
  }

  async updateCursor(nextBlock: StoryBlock){
    // Update the cursor
    return await this._cursorDataService$.updateCursor(nextBlock);
  }


}
