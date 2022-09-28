import { HandlerTools } from '@iote/cqrs';

import { Platforms } from '@app/model/convs-mgr/conversations/admin/system';
import { ChatInfo } from '@app/model/convs-mgr/conversations/chats';

/**
 * Contains all the required database flow methods for the ChatInfo collection
 */
export class ChatInfoStore {
  tools: HandlerTools;

  constructor(tools: HandlerTools) 
  {
    this.tools = tools;
  }

  async getChatInfo(phoneNumber: string, platform: Platforms): Promise<ChatInfo> {
    // Get users
    const userRepo$ = this.tools.getRepository<ChatInfo>(`end-users/${phoneNumber}/platforms`);
    const chatInfo = await userRepo$.getDocumentById(platform);

    if (!chatInfo) {
      throw new Error('This chat information has not been registered');
    }
    return chatInfo;
  }

  async registerChatInfo(info: ChatInfo, platform: Platforms): Promise<ChatInfo> {
    // Get users
    const userRepo$ = this.tools.getRepository<ChatInfo>(`end-users/${info.phoneNumber}/platforms`);

    const chatInfo: ChatInfo = {
      id: platform,
      phoneNumber: info.phoneNumber,
      orgId: info.orgId,
      storyId: info.storyId,
    };

    await userRepo$.create(chatInfo, platform.toString());
    return chatInfo;
  }

  
}
