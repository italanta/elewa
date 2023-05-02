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

  async createEndUser(endUser: EndUser)
  {

    // const newEndUser: EndUser = {
    //   phoneNumber: phoneNumber || null,
    //   endUserId,
    //   status: ChatStatus.Running,
    //   id: endUserId,

    // };

    endUser.status = ChatStatus.Running;

    return this.createDocument(endUser, this._docPath, endUser.id);
  }

  async getOrCreateEndUser(endUser: EndUser, endUserId?: string)
  {
    let currentEndUser;
    if(!endUserId) {
      currentEndUser = await this.getDocumentById(endUserId || endUser.id, this._docPath)
    }

    if(!currentEndUser) currentEndUser = await this.createEndUser(endUser);

    return currentEndUser;
  }

  async getEndUser(endUserId: string) {
    return this.getDocumentById(endUserId, this._docPath);
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

  /**
   *  Updates the end-user's conversation status to complete
   */
  async setConversationComplete(endUserId: string, value: number)
  {
    const endUser = await this.getDocumentById(endUserId, this._docPath);
    if(endUser) {
      const isConversationComplete = value;

      const newStatus: EndUser = {
        ...endUser,
        isConversationComplete
      };
  
      await this.updateDocument(newStatus, this._docPath, endUser.id);
    }
  }
}
