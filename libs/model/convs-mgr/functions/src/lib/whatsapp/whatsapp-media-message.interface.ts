import { WhatsAppBaseMessage } from "./whatsapp-base-message.interface";
import { WhatsAppMessageType } from "./whatsapp-message-types.interface";

/**
 * Contains only fields for type image
 * @extends {WhatsAppBaseMessage}
 * @see https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages#media-messages
 */
export interface WhatsAppImageMessage extends WhatsAppBaseMessage {
  type: WhatsAppMessageType,
  image: {
    link: string;
  }

}

export interface WhatsAppAudioMessage extends WhatsAppBaseMessage {
  type: WhatsAppMessageType,
  audio: {
    link: string;
  }

}
export interface WhatsAppVideoMessage extends WhatsAppBaseMessage {
  type: WhatsAppMessageType,
  video: {
    link: string;
  }

}
export interface WhatsAppStickerMessage extends WhatsAppBaseMessage {
  type: WhatsAppMessageType,
  sticker: {
    link: string;
  }

}

export interface WhatsAppDocumentMessage extends WhatsAppBaseMessage {
  type: WhatsAppMessageType,
  document: {
    link: string;
  }

}