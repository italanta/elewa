import { HandlerTools } from '@iote/cqrs';

import { BotDataService } from './data-service-abstract.class';

import { Chat, ChatStatus, Message } from '@app/model/convs-mgr/conversations/messages';

/**
 * Contains all the required database flow methods for the chat-status collection
 */
export class ChatStatusDataService extends BotDataService<Chat>{
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

  async initChatStatus(endUserId: string, chatStatus?: ChatStatus) {
    const newStatus: Chat = {
      status: chatStatus || ChatStatus.Running
    };

    const newChat = await this.createDocument(newStatus, this._docPath, endUserId)

    return newChat;
  }

  async getChatStatus(endUserId: string) {

    const chatStatus = await this.getDocumentById(endUserId, this._docPath)   

    return chatStatus;
  }

  async updateChatStatus(endUserId: string, status: ChatStatus) {
    const newStatus: Chat = {
      status
    };

   await this.createDocument(newStatus, this._docPath, endUserId)
  }
}
