import { HandlerTools } from '@iote/cqrs';

import { FunctionHandler, RestResult, HttpsContext, RestResult200 } from '@ngfi/functions';

import { ChannelDataService, generateEndUserId, MessagesDataService } from '@app/functions/bot-engine';
import { WhatsAppOutgoingMessage } from '@app/model/convs-mgr/functions';
import { PlatformType, WhatsAppCommunicationChannel } from '@app/model/convs-mgr/conversations/admin/system';
import { MessageDirection, OutgoingMessagePayload } from '@app/model/convs-mgr/conversations/messages';

import { WhatsappActiveChannel } from './models/whatsapp-active-channel.model';

import { StandardMessageOutgoingMessageParser } from './io/outgoing-message-parser/standardized-message-to-outgoing-message.parser';
import { WhatsappOutgoingMessageParser } from './io/outgoing-message-parser/whatsapp-api-outgoing-message-parser.class';

import { __SendWhatsAppWebhookVerificationToken } from './utils/validate-webhook.function';
/**
 * @Description : When an end user sends a message to the chatbot from a thirdparty application, this function is triggered, 
 *    handles the message and forwards it to whatsapp
 * 
 * Listens to messages sent from a third party app to the end user, processes them and 
 *    forwards them to the end user
 */
export class WhatsAppSendOutgoingMsgHandler extends FunctionHandler<any, RestResult>
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
  public async execute(outgoingPayload: any, context: HttpsContext, tools: HandlerTools) 
  {
    let outgoingMessagePayload: OutgoingMessagePayload;

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

      // Set the org id
      this._orgId = communicationChannel.orgId;

      // Set the technical ref
      const n = communicationChannel.n;

      // STEP 3: Create Active Channel
      //         We need to create the active channel so that the engine can use it to process and send the message
      //         The active channel contains the Communication Channel and a send message function
      //         So here we create an instance of the SendWhatsAppMessageModel which implements the active channel
      const whatsappActiveChannel = new WhatsappActiveChannel(tools, communicationChannel);

      // STEP 4: Get the latest message from the conversation
      const msgService = new MessagesDataService(tools);

      // STEP 5: Get the outgoing message in whatsapp format
      outgoingMessagePayload = new StandardMessageOutgoingMessageParser().parse(outgoingPayload, outgoingPayload.endUserPhoneNumber);

      const endUserId = generateEndUserId(outgoingPayload.endUserPhoneNumber, PlatformType.WhatsApp, n);

      const latestMessage = await msgService.getLatestMessage(endUserId, this._orgId);

      // Get the date in milliseconds
      const latestMessageTime = new Date(latestMessage ? latestMessage.createdOn : 0).getTime();

      // Check if the last message sent was more than 24hours ago
      if ((Date.now() - latestMessageTime) > 86400000) {
        const templateConfig = communicationChannel.templateConfig;
        // Send the opt-in message template

        // Get the opt-in message template
        outgoingMessagePayload = new WhatsappOutgoingMessageParser()
                                  .parseOutMessageTemplate(templateConfig, outgoingPayload.endUserPhoneNumber, outgoingPayload);
      }

      // STEP 6: Send the message
      await whatsappActiveChannel.send(outgoingMessagePayload as WhatsAppOutgoingMessage);

      return { success: true } as RestResult200;
    } catch (error) {
      tools.Logger.error(() => `[WhatsAppSendOutgoingMsgHandler].execute - Encountered an error ${error}`);
    }
  }
}
