import { IncomingMessengerMessage, IncomingMessengerPayload, MessageTypes } from "@app/model/convs-mgr/functions";


/** Function which converts the raw whatsapp incoming message to something more readable by our system. 
 * @see https://developers.facebook.com/docs/messenger-platform/reference/webhook-events/messages
 * */
export function __ConvertMessengerApiPayload(message: IncomingMessengerPayload): IncomingMessengerMessage 
{
  const messaging = message.entry[0].messaging[0];

  return {
    endUserPageId: messaging.sender.id,
    pageId: messaging.recipient.id,
    timeStamp: messaging.timestamp,

    type: __ConvertWhatsAppTypeToEngineMessageType(messaging.message),

    channel: null,

    message: messaging.message,

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
