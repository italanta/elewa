import { HandlerTools } from '@iote/cqrs';

import { Message } from '@app/model/convs-mgr/conversations/messages';

import { BotDataService } from './data-service-abstract.class';

/**
 * Contains all the required database flow methods for the messages collection
 */
export class MessagesDataService extends BotDataService<Message> {
  private _docPath: string;
  private _msg: Message;

  constructor(tools: HandlerTools) 
  {
    super(tools)
    // if (msg){
    //   this._init(msg)
    // }
  }

  // protected _init(msg: Message){
  //   this._docPath = `end-users/${msg.phoneNumber}/messages`
  //   this._msg = msg
  // }

  async saveMessage(msg: Message, orgId: string, endUserId: string): Promise<Message> {
    this._docPath = `orgs/${orgId}/end-users/${endUserId}/messages`

    msg.id = Date.now().toString()

    const savedMessage = await this.createDocument(msg, this._docPath, msg.id)

    return savedMessage;
  }

  async getLatestMessage(endUserId: string, orgId: string): Promise<Message> {
    this._docPath = `orgs/${orgId}/end-users/${endUserId}/messages`

    const latestMessage = await this.getLatestDocument(this._docPath);

    return latestMessage[0];
  }
}
