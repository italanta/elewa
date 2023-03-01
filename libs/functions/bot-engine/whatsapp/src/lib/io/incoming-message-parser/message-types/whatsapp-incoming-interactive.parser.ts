import { HandlerTools } from "@iote/cqrs";

import { ActiveChannel, IncomingInteractiveMessageParser, MessagesDataService } from "@app/functions/bot-engine";
import { QuestionMessage } from "@app/model/convs-mgr/conversations/messages";
import { InteractiveListReplyMessage, 
          InteractiveMessageType, 
          InteractiveRawButtonReplyMessage, 
          MessageTypes, 
          WhatsappInteractiveMessage, 
          WhatsAppMessagePayLoad 
        } from "@app/model/convs-mgr/functions";

export class WhatsappIncomingInteractiveParser extends IncomingInteractiveMessageParser
{

  constructor() 
  {
    super();
  }

  parse(message: WhatsAppMessagePayLoad): QuestionMessage
  {
    const interactiveMessage = message as WhatsappInteractiveMessage;

    switch (interactiveMessage.interactive.type) {
      case InteractiveMessageType.ButtonReply:
        const interactiveButtonMessage = message as InteractiveRawButtonReplyMessage;

        const buttonMessage: QuestionMessage = {
          type: MessageTypes.QUESTION,
          endUserPhoneNumber: message.from,
          options: [
            {
              optionId: interactiveButtonMessage.interactive.button_reply.id,
              optionText: interactiveButtonMessage.interactive.button_reply.title,
            },
          ],
          payload: message,
        };

        return buttonMessage;
      case InteractiveMessageType.ListReply:

        const interactiveListMessage = message as InteractiveListReplyMessage;

        const listMessage: QuestionMessage = {
          type: MessageTypes.QUESTION,
          endUserPhoneNumber: message.from,
          options: [
            {
              optionId: interactiveListMessage.interactive.list_reply.id,
              optionText: interactiveListMessage.interactive.list_reply.title,
            },
          ],
          payload: message,
        };

        return listMessage;
      default:
        return null;
    }
  }

}