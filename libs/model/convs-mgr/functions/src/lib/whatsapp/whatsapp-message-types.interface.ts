// Refer to guide for message types from whatsapp 
// https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages#send-messages

export enum WhatsAppMessageType{
  TEXT = "text",
  REACTION = "reaction",
  LOCATION = "location",
  CONTACTS = "contacts",
  INTERACTIVE = "interactive",
  IMAGE = 'image',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  STICKER = 'sticker',
  VIDEO = 'video',
  TEMPLATE = 'template',

}