import { HandlerTools } from '@iote/cqrs';

import { FunctionHandler, RestResult, HttpsContext, RestResult200 } from '@ngfi/functions';

import { ChannelDataService, generateEndUserId, MessagesDataService } from '@app/functions/bot-engine';

import { CommunicationChannel, PlatformType } from '@app/model/convs-mgr/conversations/admin/system';
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
  private _orgId: string;
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

      this._orgId = communicationChannel.orgId;

      const n = communicationChannel.n;

      // STEP 3: Create Active Channel
      //         We need to create the active channel so that the engine can use it to process and send the message
      //         The active channel contains the Communication Channel and a send message function

      // We use the active channel factory to get a specific third party platform's channel e.g. Whatsapp Active Channel
      const activeChannelFactory = new ActiveChannelFactory();

      const activeChannel = activeChannelFactory.getActiveChannel(communicationChannel, tools)

      // STEP 4: Get the outgoing message in whatsapp format
      let outgoingMessagePayload = activeChannel.parseOutStandardMessage(outgoingPayload, outgoingPayload.endUserPhoneNumber);

      // Only send the opt-in message if the platform is whatsapp
      if(communicationChannel.type === PlatformType.WhatsApp) 
      {      
      const msgService = new MessagesDataService(tools);
      
      const endUserId = generateEndUserId(outgoingPayload.endUserPhoneNumber, PlatformType.WhatsApp, n);

      const latestMessage = await msgService.getLatestMessage(endUserId, this._orgId);

      // Get the date in milliseconds
      const latestMessageTime = new Date(latestMessage ? latestMessage.createdOn : 0).getTime();

      // Check if the last message sent was more than 24hours ago
      if ((Date.now() - latestMessageTime) > 86400000) {
        const templateConfig = communicationChannel.templateConfig;
        // Send the opt-in message template

        // Get the opt-in message template
        outgoingMessagePayload = activeChannel
                                  .parseOutMessageTemplate(templateConfig, outgoingPayload.endUserPhoneNumber, outgoingPayload);
      }}

      // STEP 5: Send the message
      await activeChannel.send(outgoingMessagePayload as any);

      return { success: true } as RestResult200;
    } catch (error) {
      tools.Logger.error(() => `[WhatsAppSendOutgoingMsgHandler].execute - Encountered an error ${error}`);
    }
  }
}
