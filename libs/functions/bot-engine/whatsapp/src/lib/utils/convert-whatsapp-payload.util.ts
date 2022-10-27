import { IncomingWhatsAppMessage, WhatsAppResponse } from "@app/model/convs-mgr/functions";


/** Function which converts the raw whatsapp incoming message to something more readable by our system. **/
export function __ConvertWhatsAppApiPayload(message: IncomingWhatsAppMessage): WhatsAppResponse 
{
  message = _FormatWhatsAppPayLoad(message);

  return {
    //botAccountDisplayPhoneNumber: formattedPayLoad.entry[0].changes[0].value.metadata.display_phone_number,
    platformId:     message.entry[0].id,
    // botAccountphoneNumberId: formattedPayLoad.entry[0].changes[0].value.metadata.phone_number_id,
    endUserName:   message.entry[0].changes[0].value.contacts[0].profile.name,
    endUserNumber: message.entry[0].changes[0].value.contacts[0].wa_id,
    message:       message.entry[0].changes[0].value.messages[0],
    
    type:     message.entry[0].changes[0].value.messages[0].type as any,

    channel: null,

    payload: message
  };
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

