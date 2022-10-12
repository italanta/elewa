import { HandlerTools } from '@iote/cqrs';

import { FunctionContext, FunctionHandler, RestResult200 } from '@ngfi/functions';

import { RawMessageData } from '@app/model/convs-mgr/conversations/messages';

import { ChannelDataService, ChatStatusDataService, MessagesDataService } from '@app/functions/chatbot';
import { Platforms } from '@app/model/convs-mgr/conversations/admin/system';

import { WhatsappChannel } from 'libs/model/bot/channel/src';
import { AddMessageFactory } from './factories/platform-resolver.factory';

export class AddMessageHandler extends FunctionHandler<RawMessageData, RestResult200> {
  platform: Platforms;
  /**
   * Registers incoming messages in the messages collection which triggers the processMessage handler
   */
  public async execute(req: RawMessageData, context: FunctionContext, tools: HandlerTools) {
    tools.Logger.log(() => `[AddMessageHandler].execute: New incoming chat from channels.`);
    tools.Logger.log(() => JSON.stringify(req));

    const msgDataService  = new MessagesDataService(tools)
    const chatStatusDataService = new ChatStatusDataService(tools)
    const channelDataService = new ChannelDataService(req, tools)


    // Use factory to resolve the platform
    const AddMessageService = new AddMessageFactory(msgDataService).resolveAddMessagePlatform(req.platform)

    this.platform = req.platform

    // Check if the enduser is registered to a channel
    const messageChannel = await this.getChannelInfo(req, channelDataService)

    if (messageChannel) {
      // Add message to collection
      await AddMessageService.addMessage(req, messageChannel);
    } else {
      // Initialize chat status
      await chatStatusDataService.initChatStatus(messageChannel, this.platform)

      // Add message to collection
      await AddMessageService.addMessage(req, messageChannel);
    }

    return { success: true } as RestResult200;
  }

  async getChannelInfo(msg: RawMessageData, channelDataService: ChannelDataService){
    switch (msg.platform) {
      case Platforms.WhatsApp:
        return await channelDataService.getChannelInfo<WhatsappChannel>(msg.botUserPhoneNumber)
        
      default:
        return await channelDataService.getChannelInfo<WhatsappChannel>(msg.botUserPhoneNumber)
    }
  }
}
