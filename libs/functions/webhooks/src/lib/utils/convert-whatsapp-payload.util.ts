import { RawWhatsAppApiPayload, WhatsAppResponse } from "@app/model/convs-mgr/functions";


//Function to get the webhook response as an object
export function __ConvertWhatsAppApiPayload(payload: any): WhatsAppResponse {
  const formattedPayLoad = _FormatWhatsAppPayLoad(payload);

  const _whatsAppResponse = {
    botAccountDisplayPhoneNumber: formattedPayLoad.entry[0].changes[0].value.metadata.displayPhoneNumber,
    botAccountphonNumberId: formattedPayLoad.entry[0].changes[0].value.metadata.phoneNumberId,
    botUserName: formattedPayLoad.entry[0].changes[0].value.contacts[0].profile.name,
    botUserPhoneNumber: formattedPayLoad.entry[0].changes[0].value.contacts[0].wa_id,
    message: formattedPayLoad.entry[0].changes[0].value.messages[0]
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

