import { StoryBlockTypes } from "@app/model/convs-mgr/stories/blocks/main";
import { WhatsAppOutgoingMessage } from "./whatsapp-base-message.interface";
import { WhatsAppMessageType } from "./whatsapp-message-types.interface";

/**
 * Contains only fields for type location
 * @extends {WhatsAppMessage}
 * @see https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages#location-messages
 */
export interface WhatsAppLocationMessage extends WhatsAppOutgoingMessage {
  type: WhatsAppMessageType.LOCATION,
  location: LocationInfo
}

export interface LocationInfo{
  longitude:number;
  latitude:number;
  name?:string;
  address?:string;
}