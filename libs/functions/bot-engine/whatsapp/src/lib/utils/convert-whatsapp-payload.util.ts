import { IncomingWhatsAppMessage, MessageTypes, WhatsAppMessageType, WhatsAppResponse } from "@app/model/convs-mgr/functions";


/** Function which converts the raw whatsapp incoming message to something more readable by our system. **/
export function __ConvertWhatsAppApiPayload(message: IncomingWhatsAppMessage): WhatsAppResponse 
{
  message = _FormatWhatsAppPayLoad(message);

  return {
    //botAccountDisplayPhoneNumber: formattedPayLoad.entry[0].changes[0].value.metadata.display_phone_number,
    platformId: message.entry[0].changes[0].value.metadata.phone_number_id,
    // businessPhoneNumberId: message.entry[0].changes[0].value.metadata.phone_number_id,
    endUserName: message.entry[0].changes[0].value.contacts[0].profile.name,
    endUserNumber: message.entry[0].changes[0].value.contacts[0].wa_id,
    message: message.entry[0].changes[0].value.messages[0],

    type: __ConvertWhatsAppTypeToEngineMessageType(message.entry[0].changes[0].value.messages[0].type),

    channel: null,

    payload: message
  };
}

function __ConvertWhatsAppTypeToEngineMessageType(type: WhatsAppMessageType): MessageTypes 
{
  switch (type) {
    case WhatsAppMessageType.TEXT:
      return MessageTypes.TEXT;
    case WhatsAppMessageType.INTERACTIVE:
      return MessageTypes.QUESTION;
    case WhatsAppMessageType.AUDIO:
      return MessageTypes.AUDIO;
    case WhatsAppMessageType.CONTACTS:
      return MessageTypes.CONTACTS;
    case WhatsAppMessageType.DOCUMENT:
      return MessageTypes.DOCUMENT;
    case WhatsAppMessageType.IMAGE:
      return MessageTypes.IMAGE;
    case WhatsAppMessageType.STICKER:
      return MessageTypes.STICKER;
    case WhatsAppMessageType.VIDEO:
      return MessageTypes.VIDEO;
    default:
      break;
  }
}

/** Function which converts incoming webhook request to a readable POJO. */
function _FormatWhatsAppPayLoad(message: IncomingWhatsAppMessage): IncomingWhatsAppMessage  
{
  const formattedPayLoad: IncomingWhatsAppMessage =
  {
    object: message["object"],
    entry: message["entry"],
  };

  return formattedPayLoad;
}

