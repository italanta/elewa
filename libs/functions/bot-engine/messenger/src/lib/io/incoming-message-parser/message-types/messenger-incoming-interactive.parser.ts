import { IncomingInteractiveMessageParser } from "@app/functions/bot-engine";
import { QuestionMessage, QuestionMessageOptions } from "@app/model/convs-mgr/conversations/messages";
import { IncomingMessengerMessage, IncomingMessengerPostBackMessage, MessageTypes } from "@app/model/convs-mgr/functions";

export class MessengerIncomingInteractiveParser extends IncomingInteractiveMessageParser
{

  constructor() 
  {
    super();
  }

  parse(incomingMessage: IncomingMessengerMessage): QuestionMessage
  {
    const postbackPayload = incomingMessage.message as IncomingMessengerPostBackMessage
    // Create the base message object
    const newMessage: QuestionMessage = {
      id: Date.now().toString(),
      type: MessageTypes.QUESTION,
      options: [{
        optionId: postbackPayload.payload,
        optionText: postbackPayload.title,
        optionValue: postbackPayload.payload,
      } as QuestionMessageOptions]
    };
    return newMessage;
  }
}