import { FunctionContext, FunctionHandler, RestResult200 } from '@ngfi/functions';
import { HandlerTools, Repository } from '@iote/cqrs';

import { Chat, ChatFlowStatus, ChatInfo, ChatStatus, CHAT_ID } from '@app/model/convs-mgr/conversations/chats';

import { User } from '@iote/bricks';
import { ChatBotStore } from 'libs/functions/chatbot/src/lib/services/chatbot.store';
import { Platforms } from '@app/model/convs-mgr/conversations/admin/system';


export class RegisterEndUserHandler extends FunctionHandler<{phoneNumber: string; orgId: string; storyId: string, platform: Platforms }, ChatInfo>
{
  /**
   * Register User Handler. Records all onboarding information of a user
   *
   * @param req - Onboarding info */
  public async execute(req: {phoneNumber: string; orgId: string; storyId: string, platform: Platforms }, context: FunctionContext, tools: HandlerTools)
  {
    return await this._registerEndUser(req, tools)
  }

  private async _registerEndUser(req: {phoneNumber: string; orgId: string; storyId: string, platform: Platforms }, tools: HandlerTools): Promise<ChatInfo>{
    const chatBotStore  = new ChatBotStore(tools)
    const chatInfo: ChatInfo = {
      id: req.phoneNumber,
      orgId: req.orgId,
      storyId: req.storyId,
    }
    const newChat = await chatBotStore.registerChatInfo(chatInfo, req.platform)

    return newChat

  }

}
