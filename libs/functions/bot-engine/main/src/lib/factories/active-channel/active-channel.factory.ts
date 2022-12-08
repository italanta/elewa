import { HandlerTools } from "@iote/cqrs";

import { WhatsappActiveChannel } from "@app/functions/bot-engine/whatsapp";

import { CommunicationChannel, PlatformType } from "@app/model/convs-mgr/conversations/admin/system";

/**
 * @Description When an end user sends a message to the chatbot from a thirdparty application, we 
 *    will need to know which platform is the intended target so that we can return the right functions 
 *      specific to that platform api.
 * 
 * This factory returns the platform specific active channel.  
 * 
 * @see ActiveChannel
 */
export class ActiveChannelFactory 
{
  getActiveChannel(communicationChannel: CommunicationChannel,tools: HandlerTools)
  {
    switch (communicationChannel.type) {
      case PlatformType.WhatsApp:
        return new WhatsappActiveChannel(tools, communicationChannel);
      default:
        return new WhatsappActiveChannel(tools, communicationChannel);
    }
  }
}