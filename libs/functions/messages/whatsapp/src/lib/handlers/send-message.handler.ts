import { botProvider } from "@app/model/convs-mgr/functions";
import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";
import { HandlerTools } from "@iote/cqrs";
import { FunctionHandler, HttpsContext } from "@ngfi/functions";
import { SendWhatsAppMessageModel } from "../models/whatsapp/whatsapp-send-message.model";

export class SendMessageHandler extends FunctionHandler<{val:StoryBlock, type: botProvider}, void>{
  
  public async execute(data:{val:StoryBlock, type: botProvider}, context:HttpsContext, tools:HandlerTools)
  {
    const messageBlock = data.val;
    const provider = data.type;


  }


}