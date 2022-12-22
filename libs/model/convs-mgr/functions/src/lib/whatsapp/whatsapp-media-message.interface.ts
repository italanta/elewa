import { WhatsAppOutgoingMessage } from "./whatsapp-base-message.interface";
import { WhatsAppMessageType } from "./whatsapp-message-types.interface";

/**
 * Contains only fields for type image
 * @extends {WhatsAppMessage}
 * @see https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages#media-messages
 */
export interface WhatsAppImageMessage extends WhatsAppOutgoingMessage {
  type: WhatsAppMessageType,
  image: {
    link: string;
  }

}

export interface WhatsAppAudioMessage extends WhatsAppOutgoingMessage {
  type: WhatsAppMessageType,
  audio: {
    link: string;
  }

}
export interface WhatsAppVideoMessage extends WhatsAppOutgoingMessage {
  type: WhatsAppMessageType,
  video: {
    link: string;
  }

}
export interface WhatsAppStickerMessage extends WhatsAppOutgoingMessage {
  type: WhatsAppMessageType,
  sticker: {
    link: string;
  }

}

export interface WhatsAppDocumentMessage extends WhatsAppOutgoingMessage {
  type: WhatsAppMessageType,
  document: {
    link: string;
  }

}

export interface WhatsAppLocationMessage extends WhatsAppOutgoingMessage {
  type: WhatsAppMessageType,
  location: {
    link: string;
  }

}