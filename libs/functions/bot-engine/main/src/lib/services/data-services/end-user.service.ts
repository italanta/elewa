import { HandlerTools } from '@iote/cqrs';

import { BotDataService } from './data-service-abstract.class';

import { Message } from '@app/model/convs-mgr/conversations/messages';
import { ChatStatus, EndUser } from '@app/model/convs-mgr/conversations/chats';

/**
 * Contains all the required database flow methods for the chat-status collection
 */
export class EndUserDataService extends BotDataService<EndUser>{
  private _docPath: string;
  tools: HandlerTools;

  constructor(tools: HandlerTools) 
  {
    super(tools)
    this.tools = tools;
    this._init();
  }

  protected _init(): void 
  {
    this._docPath = `end-users`
  }

  async initEnduser(endUserId: string, chatStatus?: ChatStatus) {
    const newEndUser: EndUser = {
      phoneNumber: "",
      status: chatStatus || ChatStatus.Running
    };

    const endUser = await this.createDocument(newEndUser, this._docPath, endUserId)

    return endUser;
  }

  async getEndUser(endUserId: string) {

    const endUser = await this.getDocumentById(endUserId, this._docPath)   

    return endUser;
  }

  async updateEndUserChatStatus(endUser: EndUser, status: ChatStatus) {
    const newStatus: EndUser = {
      ...endUser,
      status,
    };
   await this.createDocument(newStatus, this._docPath, endUser.id)
  }
}
