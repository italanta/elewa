import { HandlerTools } from '@iote/cqrs';

import { BaseMessage } from '@app/model/convs-mgr/conversations/messages';
import { BotDataService } from './data-service-abstract.class';

/**
 * Contains all the required database flow methods for the messages collection
 */
export class MessagesDataService extends BotDataService<BaseMessage> {
  private _docPath: string;
  private _msg: BaseMessage;

  constructor(tools: HandlerTools, msg?: BaseMessage) 
  {
    super(tools)
    if (msg){
      this._init(msg)
    }
  }

  protected _init(msg: BaseMessage){
    this._docPath = `end-users/${msg.platform}/${msg.phoneNumber}/stories/${msg.storyId}/messages`
    this._msg = msg
  }

  async saveMessage(msg: BaseMessage): Promise<BaseMessage> {
    this._docPath = `end-users/${msg.phoneNumber}/platforms/${msg.platform}/messages`
    const timeStamp = Date.now();

    const savedMessage = await this.createDocument(msg, this._docPath, timeStamp.toString())

    return savedMessage;
  }

  async getLatestMessage(msg: BaseMessage): Promise<BaseMessage> {
    this._docPath = `end-users/${msg.phoneNumber}/platforms/${msg.platform}/messages`

    const latestMessage = await this.getLatestDocument(this._docPath);

    return latestMessage[0];
  }
}
