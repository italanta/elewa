import { HandlerTools } from '@iote/cqrs';

import { BotDataService } from './data-service-abstract.class';

import { ChatStatus, EndUser } from '@app/model/convs-mgr/conversations/chats';

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

  async createEndUser(endUser: EndUser, enrolledUserID: string)
  {

    // const newEndUser: EndUser = {
    //   phoneNumber: phoneNumber || null,
    //   endUserId,
    //   status: ChatStatus.Running,
    //   id: endUserId,

    // };
    endUser.enrolledUserId = enrolledUserID;
    endUser.status = ChatStatus.Running;

    return this.createDocument(endUser, this._docPath, endUser.id);
  }

  getAllEndUsers() 
  {
    return this.getDocuments(this._docPath);
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
  async setConversationComplete(endUserId: string, value: number, lastActiveTime?: Date)
  {
    const endUser = await this.getDocumentById(endUserId, this._docPath);
    if(endUser) {
      const isConversationComplete = value;

      const newEndUser: EndUser = {
        ...endUser,
        isConversationComplete
      };

      if(lastActiveTime) {
        newEndUser.lastActiveTime = lastActiveTime;
      }
  
      await this.updateDocument(newEndUser, this._docPath, endUser.id);
    }
  }
}
