import { HandlerTools } from '@iote/cqrs';

import { BotDataService } from './data-service-abstract.class';

import { Platforms } from '@app/model/convs-mgr/conversations/admin/system';
import { Chat, ChatStatus, BaseMessage } from '@app/model/convs-mgr/conversations/messages';
import { ChatInfo } from '@app/model/convs-mgr/conversations/chats';
import { BaseChannel } from '@app/model/bot/channel';

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
    this._docPath = `end-users/${msg.platform}/${msg.phoneNumber}/stories/${msg.storyId}`
  }

  async initChatStatus(channel: BaseChannel, platform: Platforms) {
    const chatId = channel.storyId;

    const newStatus: Chat = {
      chatId,
      status: ChatStatus.Running,
      platform: platform,
    };

    const newChat = await this.createDocument(newStatus, this._docPath, chatId)

    return newChat;
  }

  async getChatStatus(chatInfo: ChatInfo, platform: Platforms) {
    const chatId = chatInfo.storyId;

    const chatStatus = await this.getDocumentById(chatId, this._docPath)   

    return chatStatus;
  }

  async updateChatStatus(msg: BaseMessage, status: ChatStatus) {
    const chatId = msg.storyId;

    const newStatus: Chat = {
      chatId,
      status,
      platform: msg.platform,
    };

   await this.createDocument(newStatus, this._docPath, chatId)
  }
}
