import { WhatsAppBaseMessage } from "@app/model/convs-mgr/functions";
import { HandlerTools } from "@iote/cqrs";
import { FunctionHandler, HttpsContext } from "@ngfi/functions";
import { SendWhatsAppMessageModel } from "../models/whatsapp/whatsapp-send-message.model";

/**
 * @Description Used to send message to the desired provider
 */
export class SendWhatsAppMessageHandler extends FunctionHandler<{val:WhatsAppBaseMessage}, void>{
  
  public async execute(data:{val:WhatsAppBaseMessage}, context:HttpsContext, tools:HandlerTools)
  {
    tools.Logger.log(() =>`[SendWhatsAppMessageHandler] Started execution`)
    const messageBlock = data.val;
    const env = context.environment;

    return new SendWhatsAppMessageModel(tools).sendMessage(messageBlock, env)


  }


}