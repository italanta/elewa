import { MessengerActiveChannel } from '@app/functions/bot-engine/messenger';
import { WhatsappActiveChannel } from '@app/functions/bot-engine/whatsapp';
import { CommunicationChannel, PlatformType } from '@app/model/convs-mgr/conversations/admin/system';
import { HandlerTools } from '@iote/cqrs';

/**
 * Simple factory that returns the correct channel for a specific channel type.
 */
export function ___DirectChannelFactory(channel: CommunicationChannel, tools: HandlerTools)
{
  switch(channel.type)
  {
    case PlatformType.Messenger:
      return new MessengerActiveChannel(tools, channel);
    
    case PlatformType.WhatsApp:
      return new WhatsappActiveChannel(tools, channel);
  }

  throw new Error('Cannot find requested channel type');
}