import { MessengerAttachmentType } from "./messenger-attachment-types.enum";

/**
 * Raw payload from messenger.
 * 
 * @see https://developers.facebook.com/docs/messenger-platform/reference/webhook-events/messages
 */
export interface IncomingMessengerPayload {
  object: string;
  entry: MessengerEntryData[];
}

export interface MessengerEntryData { 
  id: string;
  time: number;
  messaging: MessengerMessagingData[];
}

export interface MessengerMessagingData {
  sender: MessengerSenderData;
  recipient: MessengerRecipientData;
  timestamp: number;
  message?: MessengerMessageData;
  postback?: IncomingMessengerPostBackMessage;
}

export interface MessengerSenderData {
  id: string;
}

export interface MessengerRecipientData {
  id: string;
}

export interface MessengerMessageData {
  mid: string;
}

/**
 * Incoming text message from messenger.
 * 
 * @see https://developers.facebook.com/docs/messenger-platform/reference/webhook-events/messages#text-message
 */
export interface IncomingMessengerTextMessage extends MessengerMessageData {
  text: string;
}

export interface IncomingMessengerPostBackMessage extends MessengerMessageData {
  title: string;
  payload: string;
}


/**
 * Incoming quick reply message from messenger.
 * 
 * @see https://developers.facebook.com/docs/messenger-platform/reference/webhook-events/messages#quick_reply
 */
export interface IncomingMessengerQuickReplyMessage extends MessengerMessageData {
  quick_reply: MessengerQuickReplyData;
}

export interface MessengerQuickReplyData {
  payload: string;
}

/**
 * Incoming attachment message from messenger. e.g. file, audio, video, image.
 * 
 * @see https://developers.facebook.com/docs/messenger-platform/reference/webhook-events/messages#message-with-attachment
 */
export interface MessengerAttachments extends MessengerMessageData {
  attachments: MessengerAttachmentData[];
}

export interface MessengerAttachmentData {
  payload: IncomingMessengerAttachmentPayload;
}

/**
 * Incoming image attachment from messenger.
 * 
 * @see https://developers.facebook.com/docs/messenger-platform/reference/webhook-events/messages#attachments
 */
export interface IncomingMesssengerImageAttachment extends MessengerAttachmentData {
  type: MessengerAttachmentType.IMAGE;
}

/**
 * Incoming video attachment from messenger.
 * 
 * @see https://developers.facebook.com/docs/messenger-platform/reference/webhook-events/messages#attachments
 */
export interface IncomingMesssengerVideoAttachment extends MessengerAttachmentData {
  type: MessengerAttachmentType.VIDEO;
}

/**
 * Incoming audio attachment from messenger.
 * 
 * @see https://developers.facebook.com/docs/messenger-platform/reference/webhook-events/messages#attachments
 */
export interface IncomingMesssengerAudioAttachment extends MessengerAttachmentData {
  type: MessengerAttachmentType.AUDIO;
}

/**
 * Incoming file attachment from messenger.
 * 
 * @see https://developers.facebook.com/docs/messenger-platform/reference/webhook-events/messages#attachments
 */
export interface IncomingMesssengerFileAttachment extends MessengerAttachmentData {
  type: MessengerAttachmentType.FILE;
}

/**
 * Incoming attachment payload from messenger.
 * 
 * @see https://developers.facebook.com/docs/messenger-platform/reference/webhook-events/messages#payload
 */
export interface IncomingMessengerAttachmentPayload {
  url: string;
  title: string;

  /** Applicable only when a sticker is sent via the image type */
  sticker_id?: string;
}