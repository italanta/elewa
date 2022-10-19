import { Platforms } from "@app/model/convs-mgr/conversations/admin/system";
import { RawWhatsAppApiPayload, WhatsAppMessageType, WhatsAppResponse } from "@app/model/convs-mgr/functions";


//Function to get the webhook response as an object
export function __ConvertWhatsAppApiPayload(payload: any): WhatsAppResponse {
  const formattedPayLoad = _FormatWhatsAppPayLoad(payload) as any
  console.log("formattedPayload: ", formattedPayLoad)
  const _whatsAppResponse = {
    botAccountDisplayPhoneNumber: formattedPayLoad.entry[0].changes[0].value.metadata.displayPhoneNumber,
    botAccountphoneNumberId: formattedPayLoad.entry[0].id,
    botUserName: formattedPayLoad.entry[0].changes[0].value.contacts[0].profile.name,
    botUserPhoneNumber: formattedPayLoad.entry[0].changes[0].value.contacts[0].wa_id,
    message: formattedPayLoad.entry[0].changes[0].value.messages[0],
    platform: Platforms.WhatsApp,
    messageType: formattedPayLoad.entry[0].changes[0].value.messages[0].type,
  } as WhatsAppResponse;

  return _whatsAppResponse;

}

//Formatts payload to get information that is needed from webhook
function _FormatWhatsAppPayLoad(payload): RawWhatsAppApiPayload {
  const formattedPayLoad: RawWhatsAppApiPayload = {
    object: payload["object"],
    entry: payload["entry"],
  }
  return formattedPayLoad;
}

