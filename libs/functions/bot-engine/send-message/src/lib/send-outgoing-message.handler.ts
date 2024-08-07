import { HandlerTools } from '@iote/cqrs';

import { FunctionHandler, RestResult, HttpsContext } from '@ngfi/functions';

import { ChannelDataService} from '@app/functions/bot-engine';

import { CommunicationChannel, PlatformType } from '@app/model/convs-mgr/conversations/admin/system';
import { Message, MessageDirection } from '@app/model/convs-mgr/conversations/messages';

import { ActiveChannelFactory } from '@app/functions/bot-engine/utils';
import { SendMessageResp } from './models/send-message-response.interface';

/**
 * @Description : When an end user sends a message to the chatbot from a thirdparty application, this function is triggered, 
 *    handles the message and forwards it to whatsapp
 * 
 * Listens to messages sent from a third party app to the end user, processes them and 
 *    forwards them to the end user
 */
export class SendOutgoingMsgHandler extends FunctionHandler<Message, SendMessageResp>
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
      if (!this._toSend(outgoingPayload)) return { success: false, data: "Message Direction Mismatch!" } as SendMessageResp;

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
      const outgoingMessagePayload = await activeChannel.parseOutStandardMessage(outgoingPayload);

      // STEP 5: Send the message
      const response = await activeChannel.send(outgoingMessagePayload as any, outgoingPayload);

      if(response.success) {
        tools.Logger.error(() => `[SendOutgoingMsgHandler].execute - Success in sending message ${JSON.stringify(outgoingMessagePayload)}`);
        return { success: true, data: response.data } as SendMessageResp;
      } else {
        tools.Logger.error(() => `[SendOutgoingMsgHandler].execute - Failed to send message ${JSON.stringify(outgoingMessagePayload)}`);
        
        return { success: false, data: response.data } as SendMessageResp;
      }
    } catch (error) {
      tools.Logger.error(() => `[SendOutgoingMsgHandler].execute - Encountered an error ${error}`);
      return { success: false, data: error } as SendMessageResp;
    }
  }

  private _toSend(outgoingPayload: Message) {
    if (outgoingPayload.direction === MessageDirection.FROM_AGENT_TO_END_USER) {
      return true;
    } else if(outgoingPayload.isDirect) {
      return true;
    } else {
      return false;
    }
  }
}
