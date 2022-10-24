import { HandlerTools } from '@iote/cqrs';

import { BotDataService } from './data-service-abstract.class';

import { Chat, ChatStatus, BaseMessage } from '@app/model/convs-mgr/conversations/messages';

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
  }

  protected _init(msg: BaseMessage): void {
    this._docPath = `end-users/${msg.phoneNumber}/platforms/${msg.platform}/stories`
  }

  async initChatStatus(storyId: string, message: BaseMessage) {
    this._docPath = `end-users/${message.phoneNumber}/platforms/${message.phoneNumber}/stories`

    const chatId = storyId

    const newStatus: Chat = {
      chatId,
      status: ChatStatus.Running,
      platform: message.platform,
    };

    const newChat = await this.createDocument(newStatus, this._docPath, chatId)

    return newChat;
  }

  async getChatStatus(storyId: string, message: BaseMessage) {
    this._docPath = `end-users/${message.phoneNumber}/platforms/${message.platform}/stories`

    const chatStatus = await this.getDocumentById(storyId, this._docPath)   

    return chatStatus;
  }

  async updateChatStatus(storyId: string, msg: BaseMessage, status: ChatStatus) {
    const chatId = storyId;

    const newStatus: Chat = {
      chatId,
      status,
      platform: msg.platform,
    };

   await this.createDocument(newStatus, this._docPath, chatId)
  }
}
