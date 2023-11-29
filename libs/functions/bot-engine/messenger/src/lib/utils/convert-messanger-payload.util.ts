import { IncomingMessengerMessage, IncomingMessengerPayload, MessageTypes, MessengerMessageData, MessengerMessagingData } from "@app/model/convs-mgr/functions";


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

    type: __ConvertMessengerTypeToEngineMessageType(messaging),

    channel: null,

    message: messaging.message || messaging.postback,

    payload: message
  };
}


function __ConvertMessengerTypeToEngineMessageType(message:  MessengerMessagingData): MessageTypes 
{
  let messagePayload: any;
  
  if (__isMessage(message)) {
    messagePayload = message.message;
    if(__isText(messagePayload)) {
      return MessageTypes.TEXT;
    } else if(messagePayload.attachments) {
  
      switch (messagePayload.attachments[0].type) {
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
    }
  } else if(__isPostBack(message)) {
    return MessageTypes.QUESTION;
  }
}

function __isText(message: any) {
  if(message.text) return true;
}

// function __isQuickReply(message: any) {
//   if(message.quick_reply) return true;
// }

function __isPostBack(message: any) {
  if(message.postback) return true;
}

function __isMessage(message: any) {
  if(message.message) return true;
}
