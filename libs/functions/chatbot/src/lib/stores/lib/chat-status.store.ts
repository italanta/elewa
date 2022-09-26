import { HandlerTools } from '@iote/cqrs';

import { Platforms } from '@app/model/convs-mgr/conversations/admin/system';
import { Chat, ChatStatus } from '@app/model/convs-mgr/conversations/messages';
import { ChatInfo } from '@app/model/convs-mgr/conversations/chats';

/**
 * Contains all the required database flow methods for the chat-status collection
 */
export class ChatStatusStore {
  tools: HandlerTools;

  constructor(tools: HandlerTools) 
  {
    this.tools = tools;
  }

  async initChatStatus(chatInfo: ChatInfo, platform: Platforms) {
    const chatId = chatInfo.storyId;
    const chatRepo$ = this.tools.getRepository<Chat>(`chat-status/${chatInfo.phoneNumber}/platforms/${platform}/chats`);

    const newStatus: Chat = {
      chatId,
      status: ChatStatus.Running,
      platform: platform,
    };
    const newChat = await chatRepo$.write(newStatus, chatId);

    return newChat;
  }

  async getChatStatus(chatInfo: ChatInfo, platform: Platforms) {
    const chatId = chatInfo.storyId;
    const chatRepo$ = this.tools.getRepository<Chat>(`chat-status/${chatInfo.phoneNumber}/platforms/${platform}/chats`);

    const chatStatus = await chatRepo$.getDocumentById(chatId);

    return chatStatus;
  }

  async updateChatStatus(chatInfo: ChatInfo, status: ChatStatus, platform: Platforms) {
    const chatId = chatInfo.storyId;

    const chatRepo$ = this.tools.getRepository<Chat>(`chat-status/${chatInfo.phoneNumber}/platforms/${platform}/chats`);

    const newStatus: Chat = {
      chatId,
      status,
      platform,
    };
    chatRepo$.write(newStatus, chatId);
  }
}
