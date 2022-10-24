import { HandlerTools } from '@iote/cqrs';

import { BaseMessage } from '@app/model/convs-mgr/conversations/messages';
import { BotDataService } from './data-service-abstract.class';
import { BaseChannel } from '@app/model/bot/channel';

/**
 * Contains all the required database flow methods for the messages collection
 */
export class MessagesDataService extends BotDataService<BaseMessage> {
  private _docPath: string;
  private _msg: BaseMessage;

  constructor(tools: HandlerTools, msg?: BaseMessage, channel?: BaseChannel) 
  {
    super(tools)
    if (msg){
      this._init(msg, channel)
    }
  }

  protected _init(msg: BaseMessage, channel: BaseChannel){
    this._docPath = `end-users/${msg.phoneNumber}/platforms/${msg.platform}/stories/${channel.storyId}/messages`
    this._msg = msg
  }

  async saveMessage(msg: BaseMessage, storyId: string): Promise<BaseMessage> {
    this._docPath = `end-users/${msg.phoneNumber}/platforms/${msg.platform}/stories/${storyId}/messages`
    const timeStamp = Date.now();

    const savedMessage = await this.createDocument(msg, this._docPath, timeStamp.toString())

    return savedMessage;
  }

  async getLatestMessage(msg: BaseMessage, storyId: string): Promise<BaseMessage> {
    this._docPath = `end-users/${msg.phoneNumber}/platforms/${msg.platform}/stories/${storyId}/messages`

    const latestMessage = await this.getLatestDocument(this._docPath);

    return latestMessage[0];
  }
}
