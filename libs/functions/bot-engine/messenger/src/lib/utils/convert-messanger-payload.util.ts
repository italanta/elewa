import { MessageTypes } from "@app/model/convs-mgr/functions";


/** Function which converts the raw whatsapp incoming message to something more readable by our system. 
 * @see https://developers.facebook.com/docs/messenger-platform/reference/webhook-events/messages
 * */
export function __ConvertMessengerApiPayload(message: any): any 
{
  const messaging = message.entry[0].messaging[0];

  return {
    //botAccountDisplayPhoneNumber: formattedPayLoad.entry[0].changes[0].value.metadata.display_phone_number,
    platformId: message.entry[0].changes[0].value.metadata.phone_number_id,
    endUserId: messaging.sender.id,
    pageId: messaging.recipient.id,
    timeStamp: messaging.timestamp,
    message: messaging.message[0],

    type: __ConvertWhatsAppTypeToEngineMessageType(messaging.message[0]),

    channel: null,

    payload: message
  };
}

function __ConvertWhatsAppTypeToEngineMessageType(message: any): MessageTypes 
{
  
  if(__isText(message)) {
    return MessageTypes.TEXT;
  } else if(message.attachments) {

    switch (message.attachments[0].type) {
      case 'image':
        return MessageTypes.IMAGE;
      case 'video':
        return MessageTypes.VIDEO;
      case 'audio':
        return MessageTypes.AUDIO;
      case 'file':
        return MessageTypes.DOCUMENT;
      default:
        return MessageTypes.DOCUMENT;
    }
  } else if(__isQuickReply(message)) {
    return MessageTypes.QUESTION;
  }
}

function __isText(message: any) {
  if(message.text) return true;
}

function __isQuickReply(message: any) {
  if(message.quick_reply) return true;
}
