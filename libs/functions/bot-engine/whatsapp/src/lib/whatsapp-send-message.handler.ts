import { HandlerTools } from '@iote/cqrs';

import { FunctionHandler, RestResult, HttpsContext, RestResult200 } from '@ngfi/functions';

import { ChannelDataService } from '@app/functions/bot-engine';
import { WhatsAppOutgoingMessage } from '@app/model/convs-mgr/functions';
import { WhatsAppCommunicationChannel } from '@app/model/convs-mgr/conversations/admin/system';

import { WhatsappActiveChannel } from './models/whatsapp-active-channel.model';

import { __SendWhatsAppWebhookVerificationToken } from './utils/validate-webhook.function';
import { StandardMessageOutgoingMessageParser } from './io/outgoing-message-parser/standardized-message-to-outgoing-message.parser';
import { Message, MessageDirection } from '@app/model/convs-mgr/conversations/messages';

/**
 * Listens to messages sent from the farmbetter app to the end user, processes them and 
 *    forwards them to the end user
 */
export class WhatsAppSendOutgoingMsgHandler extends FunctionHandler<Message, RestResult>
{
  /**
   * Listens to messages sent from the farmbetter app to the end user, processes them and 
   *    forwards them to the end user
   * 
   * @see https://developers.facebook.com/docs/whatsapp/
   *
   * STEP 1: Check if the message is meant for the end user
   * STEP 2: Get the Channel Information @see {CommunicationChannel}
   * STEP 3: Create Active Channel @see {ActiveChannel}
   * STEP 4: Get the outgoing message in whatsapp format.
   * STEP 5: Send the message 
   * 
   * @param {IncomingMessage} message - The message to process.
   * @returns A REST 200 or 500 response
   */
  public async execute(outgoingPayload: Message, context: HttpsContext, tools: HandlerTools) 
  {
    try {
      // STEP 1: Check if the message is meant for the end user
      if (outgoingPayload.direction !== MessageDirection.TO_END_USER) return { status: 200 } as RestResult;

      tools.Logger.log(() => `[WhatsAppSendOutgoingMsgHandler] - Outgoing message: ${JSON.stringify(outgoingPayload)}`);

      // STEP 2: Get the Channel
      //         TODO: Cache the channel
      //         The user registers the story/bot to a channel once they are ready to publish it
      //         This channel information is used to link the incoming message to the active story using the business phone number id

      // So we get registered channel information by passing the business phone number id Channel Data Service
      const _channelService$ = new ChannelDataService(tools);

      const communicationChannel = await _channelService$.getChannelByConnection(outgoingPayload.n) as WhatsAppCommunicationChannel;

      // STEP 3: Create Active Channel
      //         We need to create the active channel so that the engine can use it to process and send the message
      //         The active channel contains the Communication Channel and a send message function
      //         So here we create an instance of the SendWhatsAppMessageModel which implements the active channel
      const whatsappActiveChannel = new WhatsappActiveChannel(tools, communicationChannel);

      // STEP 4: Get the outgoing message in whatsapp format
      const outgoingMessagePayload = new StandardMessageOutgoingMessageParser().parse(outgoingPayload, outgoingPayload.endUserPhoneNumber);

      // STEP 5: Send the message
      await whatsappActiveChannel.send(outgoingMessagePayload as WhatsAppOutgoingMessage);

      return { success: true } as RestResult200;
    } catch (error) {
      tools.Logger.error(() => `[WhatsAppSendOutgoingMsgHandler].execute - Encountered an error ${error}`);
    }
  }
}
