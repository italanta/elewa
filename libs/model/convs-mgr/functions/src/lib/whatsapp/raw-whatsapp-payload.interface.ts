/**
 * The type of object returned by the webhook as a Response object
 * @see https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/components
 */

import { BaseMessage } from "@app/model/convs-mgr/conversations/messages";
import { WhatsAppMessageType } from "./whatsapp-message-types.interface";

export interface RawWhatsAppApiPayload {
  object: string;
  entry: WhatsAppEntryFormData[];
}

export interface WhatsAppEntryFormData {
  //Id of business that owns the bot account
  whatsAppBusinessId: string;

  //Information about messsage sent by the bot user, the bot account
  changes: WhatsAppEntryFormDataChanges[];
}

export interface WhatsAppEntryFormDataChanges {
  value: {

    //Refers to meta products such as whatsapp, instagram and messenger
    messagingProduct: string;

    //Information about the botAccount
    metadata: { displayPhoneNumber: string; phoneNumberId: string };

    contacts: {
      //Name of bot user
      profile: {name:string},
  
      //Phone number of bot user
      wa_id: string
    }[],

    messages : WhatsAppMessagePayLoad[];

    info?: {} //specific webhook payload info can be added
  },

  //Extra 
  field?: string,

  


}
export interface WhatsAppMessagePayLoad extends BaseMessage{
  from: string,
  id: string,
  timeStamp: string,
  type: WhatsAppMessageType
}

export interface TextMessagePayload extends WhatsAppMessagePayLoad {
  text: {
    body: string,
    preview_url?: boolean
  }
}

export interface ImagePayload extends WhatsAppMessagePayLoad {
  mime_type: string;
  sha256:string;
}

