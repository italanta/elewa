import { RawWhatsAppApiPayload } from "@app/model/convs-mgr/functions";


//Function to get the webhook response as an object
export function __ConvertWhatsAppApiPayload(payload: any): RawWhatsAppApiPayload {
  const convertedPayload: RawWhatsAppApiPayload = {
    object: payload["object"],
    entry: payload["entry"],
  }
  return convertedPayload;
}

