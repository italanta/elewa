import { BotProvider } from "@app/model/convs-mgr/functions";
import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";
import { HandlerTools } from "@iote/cqrs";
import { FunctionHandler, HttpsContext } from "@ngfi/functions";
import { SendWhatsAppMessageModel } from "../models/whatsapp/whatsapp-send-message.model";

export class SendMessageHandler extends FunctionHandler<{val:StoryBlock, type: BotProvider}, void>{
  
  public async execute(data:{val:StoryBlock, type: BotProvider}, context:HttpsContext, tools:HandlerTools)
  {
    tools.Logger.log(() =>`[SendMessageHandler] Started execution with : ${data.type} ${data.val} ${data.type}`)
    const messageBlock = data.val;
    const provider = data.type;
    const env = context.environment;

    return new SendWhatsAppMessageModel(tools).sendMessage(messageBlock, env)


  }


}