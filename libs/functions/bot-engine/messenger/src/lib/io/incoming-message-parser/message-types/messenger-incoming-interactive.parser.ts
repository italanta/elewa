import { IncomingInteractiveMessageParser } from "@app/functions/bot-engine";
import { IncomingMessagePayload, QuestionMessage } from "@app/model/convs-mgr/conversations/messages";

export class MessengerIncomingInteractiveParser extends IncomingInteractiveMessageParser
{

  constructor() 
  {
    super();
  }

  parse(message: IncomingMessagePayload): QuestionMessage
  {
    return null;
  }

}