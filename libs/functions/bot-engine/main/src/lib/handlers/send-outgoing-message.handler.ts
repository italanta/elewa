import { HandlerTools } from '@iote/cqrs';

import { FunctionHandler, RestResult, HttpsContext, RestResult200 } from '@ngfi/functions';

import { ChannelDataService } from '@app/functions/bot-engine';

import { CommunicationChannel } from '@app/model/convs-mgr/conversations/admin/system';
import { Message, MessageDirection } from '@app/model/convs-mgr/conversations/messages';

import { ActiveChannelFactory } from '../factories/active-channel/active-channel.factory';

/**
 * @Description : When an end user sends a message to the chatbot from a thirdparty application, this function is triggered, 
 *    handles the message and forwards it to whatsapp
 * 
 * Listens to messages sent from a third party app to the end user, processes them and 
 *    forwards them to the end user
 */
export class SendOutgoingMsgHandler extends FunctionHandler<Message, RestResult>
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

      const communicationChannel = await _channelService$.getChannelByConnection(outgoingPayload.n) as CommunicationChannel;

      // STEP 3: Create Active Channel
      //         We need to create the active channel so that the engine can use it to process and send the message
      //         The active channel contains the Communication Channel and a send message function

      // We use the active channel factory to get a specific third party platform's channel e.g. Whatsapp Active Channel
      const activeChannelFactory = new ActiveChannelFactory();

      const activeChannel = activeChannelFactory.getActiveChannel(communicationChannel, tools)

      // STEP 4: Get the outgoing message in whatsapp format
      const outgoingMessagePayload = activeChannel.parseOutStandardMessage(outgoingPayload, outgoingPayload.endUserPhoneNumber);

      // STEP 5: Send the message
      await activeChannel.send(outgoingMessagePayload as any);

      return { success: true } as RestResult200;
    } catch (error) {
      tools.Logger.error(() => `[WhatsAppSendOutgoingMsgHandler].execute - Encountered an error ${error}`);
    }
  }
}
