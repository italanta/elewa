import { HandlerTools } from '@iote/cqrs';

import { BotDataService } from './data-service-abstract.class';

import { Message } from '@app/model/convs-mgr/conversations/messages';
import { ChatStatus, EndUser } from '@app/model/convs-mgr/conversations/chats';
import { throws } from 'assert';

/**
 * Contains all the required database flow methods for the chat-status collection
 */
 export class EndUserDataService extends BotDataService<EndUser>{
  private _docPath: string;
  tools: HandlerTools;

  constructor(tools: HandlerTools, orgId: string) 
  {
    super(tools);
    this.tools = tools;
    this._init(orgId);
  }

  protected _init(orgId: string): void 
  {
    this._docPath = `orgs/${orgId}/end-users`;
  }

  async createEndUser(endUserId: string, phoneNumber: string)
  {
    const newEndUser: EndUser = {
      phoneNumber,
      status: ChatStatus.Running,
      id: endUserId,

    };

    const endUser = await this.createDocument(newEndUser, this._docPath, endUserId);

    return endUser;
  }

  async getOrCreateEndUser(endUserId: string, phoneNumber: string)
  {

    let endUser = await this.getDocumentById(endUserId, this._docPath);

    if(!endUser) endUser = await this.createEndUser(endUserId, phoneNumber);

    return endUser;
  }

  async updateEndUser(endUser: EndUser)
  {
   return this.updateDocument(endUser, this._docPath, endUser.id)
  }

  async updateEndUserChatStatus(endUser: EndUser, status: ChatStatus)
  {
    const newStatus: EndUser = {
      ...endUser,
      status,
    };
    await this.createDocument(newStatus, this._docPath, endUser.id);
  }
}
