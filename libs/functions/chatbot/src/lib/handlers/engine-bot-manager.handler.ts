import { HandlerTools } from '@iote/cqrs';
import { FunctionContext, FunctionHandler, RestResult200 } from '@ngfi/functions';

import { RawMessageData } from '@app/model/convs-mgr/conversations/messages';

import { BotEngineChatManager } from '../services/bot-engine-chat-manager.service';
import { MessagesDataService } from '../services/data-services/messages.service';
import { ChatStatusDataService } from '../services/data-services/chat-status.service';
import { ChannelDataService } from '../services/data-services/channel-info.service';

/**
 * Triggered by document.create in 'messages/{phoneNumber}/platforms/{platform}/msgs/{messageId}'
 * Processes the message and returns the next block.
 */
export class EngineBotManagerHandler extends FunctionHandler<RawMessageData, RestResult200>
{
  public async execute(req: RawMessageData, context: FunctionContext, tools: HandlerTools)
  {
    tools.Logger.log(() => `[EngineChatManagerHandler].execute: New incoming chat from channels.`);
    tools.Logger.log(() => JSON.stringify(req));

    try {
    // To later use a DI container to manage instances and dynamically inject approtiate dependencies
    const messageDataService  = new MessagesDataService(tools)
    const chatStatusDataService = new ChatStatusDataService(tools)
    const channelDataService = new ChannelDataService(req, tools)


    const chatManager = new BotEngineChatManager(messageDataService, chatStatusDataService, channelDataService, tools, req.platform)

    await chatManager.main(req)

    return { success: true} as RestResult200

    } catch (error) {

      tools.Logger.error(() => `[EngineChatManagerHandler].execute: Chat Manager encountered an error: ${error}`);
      
    }
  }

}
