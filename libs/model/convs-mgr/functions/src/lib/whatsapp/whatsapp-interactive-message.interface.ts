import { StoryBlockTypes } from "@app/model/convs-mgr/stories/blocks/main";
import { WhatsAppBaseMessage } from "./whatsapp-base-message.interface";
import { WhatsAppMessageType } from "./whatsapp-message-types.interface";

/**
 * Contains only fields for type intercative
 * @extends {WhatsAppBaseMessage}
 * @see https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages#interactive-messages
 */
export interface WhatsAppInteractiveMessage extends WhatsAppBaseMessage {
  type: StoryBlockTypes.QuestionBlock,
  interactive: InteractiveInfo
}

interface InteractiveInfo {
  type: 'list',
  header: { type: WhatsAppMessageType.TEXT, text: string },
  body:{ text: string },
  footer:{ text: string },
  action: ActionInfo
}

interface ActionInfo {
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


