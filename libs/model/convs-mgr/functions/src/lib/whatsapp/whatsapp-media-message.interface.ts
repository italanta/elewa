import { WhatsAppMessage } from "./whatsapp-base-message.interface";
import { WhatsAppMessageType } from "./whatsapp-message-types.interface";

/**
 * Contains only fields for type image
 * @extends {WhatsAppMessage}
 * @see https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages#media-messages
 */
export interface WhatsAppImageMessage extends WhatsAppMessage {
  type: WhatsAppMessageType,
  image: {
    link: string;
  }

}

export interface WhatsAppAudioMessage extends WhatsAppMessage {
  type: WhatsAppMessageType,
  audio: {
    link: string;
  }

}
export interface WhatsAppVideoMessage extends WhatsAppMessage {
  type: WhatsAppMessageType,
  video: {
    link: string;
  }

}
export interface WhatsAppStickerMessage extends WhatsAppMessage {
  type: WhatsAppMessageType,
  sticker: {
    link: string;
  }

}

export interface WhatsAppDocumentMessage extends WhatsAppMessage {
  type: WhatsAppMessageType,
  document: {
    link: string;
  }

}