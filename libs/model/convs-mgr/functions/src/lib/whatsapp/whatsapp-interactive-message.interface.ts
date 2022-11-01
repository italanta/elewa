import { WhatsAppOutgoingMessage } from "./whatsapp-base-message.interface";
import { WhatsAppMessageType } from "./whatsapp-message-types.interface";

/**
 * Contains only fields for type intercative
 * @extends {WhatsAppMessage}
 * @see https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages#interactive-messages
 */
export interface WhatsAppInteractiveMessage extends WhatsAppOutgoingMessage {
  type: WhatsAppMessageType.INTERACTIVE,
  interactive: InteractiveInfo
}

interface InteractiveInfo {
  body:{ text: string },
}

export interface InteractiveListMessage extends InteractiveInfo {
  type: 'list',
  header: { type: WhatsAppMessageType.TEXT, text: string },
  footer:{ text: string },
  action: ActionInfo
}

export interface InteractiveButtonMessage extends InteractiveInfo {
  type: 'button',
  action: {
    buttons: ActionButtonsInfo[]
  }
}

export interface ActionButtonsInfo {
  //Contains text of on Button
  type: 'reply',
  reply: {
    id: string,
    title: string
  }
}

export interface ActionInfo {
  //Contains text of on Button
  button: string,
  sections: ActionSectionInfo[]
}

//Can have multiple sections for every action
interface ActionSectionInfo {
  title: string,
  rows: ActionSectionInfoRow[]
}

//Can have multiple rows per section
interface ActionSectionInfoRow {
  id: string,
  title: string,
  description?: string
}


