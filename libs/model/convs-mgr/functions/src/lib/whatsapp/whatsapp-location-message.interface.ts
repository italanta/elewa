import { StoryBlockTypes } from "@app/model/convs-mgr/stories/blocks/main";
import { WhatsAppBaseMessage } from "./whatsapp-base-message.interface";
import { WhatsAppMessageType } from "./whatsapp-message-types.interface";

/**
 * Contains only fields for type location
 * @extends {WhatsAppBaseMessage}
 * @see https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages#location-messages
 */
export interface WhatsAppLocationMessage extends WhatsAppBaseMessage {
  type: WhatsAppMessageType.LOCATION,
  location: LocationInfo
}

interface LocationInfo{
  longitude:number;
  latitude:number;
  name:string;
  address:string;
}