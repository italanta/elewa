import { HandlerTools } from '@iote/cqrs';

import { FunctionHandler, RestResult, HttpsContext } from '@ngfi/functions';

import { IncomingWhatsAppMessage } from '@app/model/convs-mgr/functions';
import { ChannelDataService, EngineBotManager, generateEndUserId } from '@app/functions/bot-engine';
import { MessengerCommunicationChannel, MessengerEndUser, PlatformType } from '@app/model/convs-mgr/conversations/admin/system';

import { MessengerActiveChannel } from './models/messenger-active-channel.model';

import { MessengerIncomingMessageParser } from './io/incoming-message-parser/messenger-api-incoming-message-parser.class';

import { __ValidateVerificationRequest } from './utils/validate-webhook.function';
import { __ConvertMessengerApiPayload } from './utils/convert-messanger-payload.util';

/**
 * Receives a message, through a channel registered on the WhatsApp Business API,
 *    handles it, and potentially responds to it.
 */
export class MessengerReceiveMsgHandler extends FunctionHandler<IncomingWhatsAppMessage, RestResult>
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
  public async execute(payload: any, context: HttpsContext, tools: HandlerTools) 
  {
    try {
      // STEP 1: Validate the token
    // Check if the data received contains the validation token
    // @See https://developers.facebook.com/docs/messenger-platform/webhooks#configure-webhooks-product

    const mode = context.eventContext.request.query['hub.mode'];
    const token = context.eventContext.request.query["hub.verify_token"];

    if (mode && token) return __ValidateVerificationRequest(context, mode, token, tools);
    // Only proceed when we have the messages object.
    if (!payload) return { status: 400, message: "No messages in incoming payload to process" } as RestResult;

    tools.Logger.log(() => `Received Messenger msg ${JSON.stringify(payload)}`);

    // STEP 2: We have validated.
    //         We now unpack the message and search for the correct channel
    //         The message is converted to a generic object our engine can understand.
    //         We then need to parse the incoming message and return a standardized format so that our bot engine can read and process the message
    const sanitizedResponse = __ConvertMessengerApiPayload(payload);

    tools.Logger.log(() => `Sanitized Response: ${JSON.stringify(sanitizedResponse)}`);

    // STEP 3: Get the Channel
    //         TODO: Cache the channel
    //         The user registers the story/bot to a channel once they are ready to publish it
    //         This channel information is used to link the incoming message to the active story using the business phone number id

    // So we get registered channel information by passing the business phone number id Channel Data Service
    const _channelService$ = new ChannelDataService(tools, sanitizedResponse);

    const communicationChannel = await _channelService$.getChannelInfo(sanitizedResponse.pageId) as MessengerCommunicationChannel;

    if (!communicationChannel) {
      tools.Logger.error(() => `[ChannelInfo].getChannelInfo - This phone number has not been registered to a channel: ID: ${sanitizedResponse.pageId}`);

      return { status: 500 } as RestResult;
    }

    tools.Logger.log(() => `[ChannelInfo].getChannelInfo - Channel Information acquired successfully: ${JSON.stringify(communicationChannel)}`);

    // STEP 4: Create Active Channel
    //         We need to create the active channel so that the engine can use it to process and send the message
    //         The active channel contains the Communication Channel and a send message function
    //         So here we create an instance of the SendWhatsAppMessageModel which implements the active channel
    const messengerActiveChannel = new MessengerActiveChannel(tools, communicationChannel);

    // STEP 5: Create the bot engine and process the message.
    //        Since we receive different types of messages e.g. text message, location,
    const engine = new EngineBotManager(tools, tools.Logger, messengerActiveChannel);

    const messengerIncomingMessageParser = new MessengerIncomingMessageParser().resolve(sanitizedResponse.type);

    const message = messengerIncomingMessageParser.parse(sanitizedResponse);

    // Don't process the message if we cannot parse it
    if (!message) return { status: 500, message: `Failed to parse incoming message: ${sanitizedResponse.message}` } as RestResult;

    const messengerEndUser: MessengerEndUser = {
      id: generateEndUserId(sanitizedResponse.endUserPageId, PlatformType.Messenger, communicationChannel.n),
      endUserPageId: sanitizedResponse.endUserPageId,
    }
    
    // STEP 6: Pass the standardized message and run the bot engine
    return engine.run(message, messengerEndUser);
    } catch (error) {
      tools.Logger.error(() => `[MessengerReceiveMsgHandler].execute - Error processing message: ${error}`);

      return { status: 500 } as RestResult; 
    }
  }  
}

