import { FunctionContext, FunctionHandler } from '@ngfi/functions';
import { HandlerTools } from '@iote/cqrs';

import { ChatBotStore } from '@app/functions/chatbot';

import { ChatInfo } from '@app/model/convs-mgr/conversations/chats';
import { Platforms } from '@app/model/convs-mgr/conversations/admin/system';


/**
 * Register User Handler. Records all onboarding information of a user
 *
 * @param req - Onboarding info */
export class RegisterEndUserHandler extends FunctionHandler<{phoneNumber: string; orgId: string; storyId: string, platform: Platforms }, ChatInfo>
{
  public async execute(req: {phoneNumber: string; orgId: string; storyId: string, platform: Platforms }, context: FunctionContext, tools: HandlerTools)
  {
    return await this._registerEndUser(req, tools)
  }

  private async _registerEndUser(req: {phoneNumber: string; orgId: string; storyId: string, platform: Platforms }, tools: HandlerTools): Promise<ChatInfo>{
    const chatBotStore  = new ChatBotStore(tools)
    const chatInfo: ChatInfo = {
      id: req.platform,
      phoneNumber: req.phoneNumber,
      orgId: req.orgId,
      storyId: req.storyId,
    }
    const newChat = await chatBotStore.chatInfo().registerChatInfo(chatInfo, req.platform)

    return newChat

  }

}
