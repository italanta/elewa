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

export class MessengerIncomingInteractiveParser extends IncomingInteractiveMessageParser
{

  constructor() 
  {
    super();
  }

  parse(message: WhatsAppMessagePayLoad): QuestionMessage
  {
    return null;
  }

}