import { TextMessage } from "@app/model/convs-mgr/conversations/messages";
import { MessageTypes } from "@app/model/convs-mgr/functions";

/**
 * Creates a text message object from a simple text.
 * 
 * @param text
 * @returns textMessage
 */
export function createTextMessage(text: string)
{
  return {
    type: MessageTypes.TEXT,
    text
  } as TextMessage
}