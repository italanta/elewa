import { FileMessage } from "@app/model/convs-mgr/conversations/messages";
import { Message, MessageTypes, WhatsAppMessageType } from "@app/model/convs-mgr/functions";

export class WhatsappIncomingMessageParser {
  public parse(messageType: MessageTypes, incomingMessage: any): Message | null {
    switch (messageType) {
      case MessageTypes.STICKER:
        if (incomingMessage.type === WhatsAppMessageType.STICKER) {
          const { mime_type, sticker: { sha256, id } } = incomingMessage;
          return {
            type: MessageTypes.STICKER,
            mediaId: id,
            mime_type,
            sha256,
          };
        }
        break;
      default:
        break;
    }
    return null;
  }
}
