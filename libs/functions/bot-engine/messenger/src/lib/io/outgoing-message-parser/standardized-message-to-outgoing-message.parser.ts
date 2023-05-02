import
{
  MessageTypes,
  MessengerMessagingTypes,
  MessengerOutgoingTextMessage,
} from '@app/model/convs-mgr/functions';

import { 
  Message, 
  OutgoingMessagePayload, 
  TextMessage, 
} from '@app/model/convs-mgr/conversations/messages';

/**
 * Interprets our standardized messages @see {Message} to a whatsapp message
 * 
 * @param {Message} - The standardized message format to be converted to whatsapp message
 * @param {phone} - Thep phone number of the end user
 * 
 * @see https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages
 */
export class StandardMessageOutgoingMessageParser
{
  /**
   * @Description Used to send message of type text to whatsapp api
   */
  private _getTextMessageParserOut(message: TextMessage, recepientId: string): any
  {

    // Create the text payload which will be sent to api
    const generatedMessage: MessengerOutgoingTextMessage = {
      messaging_type: MessengerMessagingTypes.RESPONSE,
      recipient: {
        id: recepientId,
      },
      message: { 
        text: message.text,
      }
    };

    return generatedMessage;
  }

  parse(message: Message, phone: string): OutgoingMessagePayload
  {
    let parser!: (message: Message, phone: string) => OutgoingMessagePayload;

    switch (message.type) {
      case MessageTypes.TEXT:                     parser = this._getTextMessageParserOut; break;
      // case MessageTypes.AUDIO:                    parser = this._getAudioMessageParserOut; break;
      // case MessageTypes.VIDEO:                    parser = this._getVideoMessageParserOut; break;
      // case MessageTypes.IMAGE:                    parser = this._getImageMessageParserOut; break;
      // case MessageTypes.LOCATION:                 parser = this._getLocationMessageParserOut; break;
      default:
        parser = this._getTextMessageParserOut;
    }

    return parser(message, phone);
  }
}
