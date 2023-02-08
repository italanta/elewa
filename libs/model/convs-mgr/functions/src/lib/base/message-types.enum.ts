
/**
 * Our chatbot recieves different types of messages, be it a text message, a location, an image, ... from the end user
 * 
 * These are the defined message types handled within our bot engine.
 */
export enum MessageTypes 
{
  TEXT              = "text",
  REACTION          = "reaction",
  IMAGE             = "image",
  LOCATION          = "location",
  CONTACTS          = "contacts",
  QUESTION          = "question",
  AUDIO             = 'audio',
  DOCUMENT          = 'document',
  STICKER           = 'sticker',
  VIDEO             = 'video'
}

export function isFileMessage(messageType: MessageTypes): boolean {
  switch (messageType) {
    case MessageTypes.IMAGE:
    case MessageTypes.AUDIO:
    case MessageTypes.VIDEO:
    case MessageTypes.DOCUMENT:
      return true;
    default:
      return false;
}
}