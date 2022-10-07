import { HandlerTools } from '@iote/cqrs';

import { BaseMessage } from '@app/model/convs-mgr/conversations/messages';
import { BotDataService } from './data-service-abstract.class';

/**
 * Contains all the required database flow methods for the messages collection
 */
export class MessagesDataService extends BotDataService<BaseMessage> {
  private _docPath: string;
  private _msg: BaseMessage;

  constructor(msg: BaseMessage,tools: HandlerTools) 
  {
    super(tools)
    this._init(msg)
  }

  protected _init(msg: BaseMessage){
    this._docPath = `end-users/${msg.phoneNumber}/platforms/${msg.platform}/messages`
    this._msg = msg
  }

  async saveMessage(): Promise<BaseMessage> {
    const timeStamp = Date.now();

    const savedMessage = await this.createDocument(this._msg, this._docPath, timeStamp.toString())

    return savedMessage;
  }

  async getLatestMessage(): Promise<BaseMessage> {

    const latestMessage = await this.getLatestDocument(this._docPath);

    return latestMessage[0];
  }
}
