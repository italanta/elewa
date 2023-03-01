import { HandlerTools } from '@iote/cqrs';

import { FunctionHandler, RestResult, HttpsContext } from '@ngfi/functions';

import { ChannelDataService, EndUserDataService, EngineBotManager, generateEndUserId, MessagesDataService } from '@app/functions/bot-engine';
import { IncomingWhatsAppMessage } from '@app/model/convs-mgr/functions';
import { PlatformType, WhatsAppCommunicationChannel } from '@app/model/convs-mgr/conversations/admin/system';

import { WhatsappActiveChannel } from './models/whatsapp-active-channel.model';

import { __ConvertWhatsAppApiPayload } from './utils/convert-whatsapp-payload.util';
import { __SendWhatsAppWebhookVerificationToken } from './utils/validate-webhook.function';

import { WhatsappIncomingMessageParser } from './io/incoming-message-parser/whatsapp-api-incoming-message-parser.class';
/**
 * Receives a message, through a channel registered on the WhatsApp Business API,
 *    handles it, and potentially responds to it.
 */
export class WhatsAppReceiveIncomingMsgHandler extends FunctionHandler<IncomingWhatsAppMessage, RestResult>
{
  /**
   * Receives a message, through a channel registered on the WhatsApp Business API,
   *    handles it, and potentially responds to it.
   * @see https://developers.facebook.com/docs/whatsapp/
   *
   * STEP 1: Validate that this is an incoming message (could also be .e.g. WhatsApp webhook verification process)
   * STEP 2: Unpack the message and search for the correct channel
   * STEP 3: Get the Channel Information @see {CommunicationChannel}
   * STEP 4: Create Active Channel @see {ActiveChannel}
   * STEP 5: Let our bot engine process it.
   *          Since we receive different types of messages e.g. text message, location,
   *            we need to parse it and return a standardized format so that our bot engine can read and process the message
   *              @see {IncomingMessageParser}
   * STEP 6: Pass the standardized message and run the bot engine
   *
   * @param {IncomingMessage} message - The message to process.
   * @returns A REST 200 or 500 response
   */
  public async execute(payload: IncomingWhatsAppMessage, context: HttpsContext, tools: HandlerTools) 
  {
    // STEP 1: Validate that this is an incoming message
    // Check if we have any data. If there is no data,then the webhook needs to be validated on whatsapp business platform
    // @See https://developers.facebook.com/docs/whatsapp/cloud-api/guides/set-up-webhooks
    if (this._dataResIsEmpty(payload)) return __SendWhatsAppWebhookVerificationToken(context, tools);
    // Only proceed when we have the messages object.
    if (!payload.entry[0].changes[0].value.messages) return { status: 400, message: "No messages in incoming payload to process" } as RestResult;

    tools.Logger.log(() => `Received Whatsapp msg ${JSON.stringify(payload.entry[0].changes)}`);

    // STEP 2: We have validated.
    //         We now unpack the message and search for the correct channel
    //         The message is converted to a generic object our engine can understand.
    //         We then need to parse the incoming message and return a standardized format so that our bot engine can read and process the message
    const sanitizedResponse = __ConvertWhatsAppApiPayload(payload);

    // STEP 3: Get the Channel
    //         TODO: Cache the channel
    //         The user registers the story/bot to a channel once they are ready to publish it
    //         This channel information is used to link the incoming message to the active story using the business phone number id

    // So we get registered channel information by passing the business phone number id Channel Data Service
    const _channelService$ = new ChannelDataService(tools, sanitizedResponse);

    const communicationChannel = await _channelService$.getChannelInfo(sanitizedResponse.platformId) as WhatsAppCommunicationChannel;

    if (!communicationChannel) {
      tools.Logger.error(() => `[ChannelInfo].getChannelInfo - This phone number has not been registered to a channel: ID: ${sanitizedResponse.platformId}`);

      return { status: 500 } as RestResult;
    }

    tools.Logger.log(() => `[ChannelInfo].getChannelInfo - Channel Information acquired successfully: ${JSON.stringify(communicationChannel)}`);

    // STEP 4: Create Active Channel
    //         We need to create the active channel so that the engine can use it to process and send the message
    //         The active channel contains the Communication Channel and a send message function
    //         So here we create an instance of the SendWhatsAppMessageModel which implements the active channel
    const whatsappActiveChannel = new WhatsappActiveChannel(tools, communicationChannel);

    // STEP 5: Create the bot engine and process the message.
    //        Since we receive different types of messages e.g. text message, location,
    const engine = new EngineBotManager(tools, tools.Logger, whatsappActiveChannel);

    const _msgDataService$ = new MessagesDataService(tools);

    const whatsappIncomingMessageParser = new WhatsappIncomingMessageParser().resolve(sanitizedResponse.type);

    const message = whatsappIncomingMessageParser.parse(sanitizedResponse.message);

    // Don't process the message if we cannot parse it
    if (!message) return { status: 500, message: `Failed to parse incoming message: ${sanitizedResponse.message}` } as RestResult;
    
    // STEP 6: Pass the standardized message and run the bot engine
    return engine.run(message);
  }

  /**
   * Method which checks if the whatsapp data object is empty.
   *  This means the webhook has not yet been verified. */
  private _dataResIsEmpty(data) 
  {
    return Object.keys(data).length === 0;
  }
}
